import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import * as firebase from "../services/firebase";
import useAuth from "./useAuth";
import useAlerts from "./useAlerts";
import { deleteField, doc, updateDoc } from "firebase/firestore";
import useFirebase from "./useFirebase";
import { removeBadPlannedWorkoutsAndReturnFixed } from "../utils/workoutUtils";
const CurrentWorkoutContext = createContext({});
export const CurrentWorkoutProvider = ({ children }) => {
  const { db } = useFirebase();
  const { user } = useAuth();
  const { newWorkoutsAlerts } = useAlerts();
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const clearIntervalOrTimeoutFunc = () => {
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  function getMsUntilNextQuarterHour() {
    const now = new Date();
    const timeToNextQuarterHour =
      (15 - (now.getMinutes() % 15)) * 60000 -
      now.getSeconds() * 1000 -
      now.getMilliseconds();
    return timeToNextQuarterHour;
  }
  useEffect(() => {
    const checkIfCurrentWorkout = async () => {
      const now = new Date();
      var foundWorkout = false;
      for (var [key, value] of Object.entries(user.plannedWorkouts)) {
        if (
          new Date(value[0].toDate().getTime() + value[1] * 60000) > now &&
          value[0].toDate() <= now
        ) {
          foundWorkout = true;
          if (newWorkoutsAlerts[key] != null) {
            try {
              await updateDoc(doc(db, `alerts/${user.id}`), {
                [`newWorkouts.${key}`]: deleteField(),
              });
            } catch (error) {
              console.log(error);
            }
          }

          const workout = await firebase.getWorkout(key);

          return { ...workout, id: key };
        }
      }
    };
    const initialCheckCurrentWorkout = async () => {
      // Get the current time
      const now = new Date();

      // Call the function immediately on the initial render
      const currWorkout = await checkIfCurrentWorkout();
      if (currWorkout != null) setCurrentWorkout(currWorkout);
      else if (currentWorkout) {
        setCurrentWorkout();
        removeOldUnconfirmedFromPlannedWorkout();
      }
      timeoutRef.current = setTimeout(async () => {
        timeoutRef.current = null;
        const currWorkout = await checkIfCurrentWorkout();
        if (currWorkout != null) setCurrentWorkout(currWorkout);
        else if (currentWorkout) {
          setCurrentWorkout();
          removeOldUnconfirmedFromPlannedWorkout();
        }
        intervalRef.current = setInterval(
          async () => {
            const currWorkout = await checkIfCurrentWorkout();
            if (currWorkout != null) setCurrentWorkout(currWorkout);
            else if (currentWorkout) {
              setCurrentWorkout();
              removeOldUnconfirmedFromPlannedWorkout();
            }
          },
          15 * 60 * 1000
        );
      }, getMsUntilNextQuarterHour());
    };

    clearIntervalOrTimeoutFunc();
    if (user) {
      initialCheckCurrentWorkout();
    }
  }, [user?.plannedWorkouts]);

  const removeOldUnconfirmedFromPlannedWorkout = () => {
    updateDoc(doc(db, "users", user.id), {
      plannedWorkouts: removeBadPlannedWorkoutsAndReturnFixed(user),
    });
  };
  useEffect(() => {
    return () => clearIntervalOrTimeoutFunc();
  }, []);
  return (
    <CurrentWorkoutContext.Provider
      value={{ currentWorkout, setCurrentWorkout }}
    >
      {children}
    </CurrentWorkoutContext.Provider>
  );
};
export default function useCurrentWorkout() {
  return useContext(CurrentWorkoutContext);
}
