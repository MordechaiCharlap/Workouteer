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
  const { user, userLoaded } = useAuth();
  const { newWorkoutsAlerts } = useAlerts();
  const [currentWorkout, setCurrentWorkout] = useState(null);

  const getMsUntilNextQuarterHour = () => {
    const now = new Date();
    const timeToNextQuarterHour =
      (15 - (now.getMinutes() % 15)) * 60000 -
      now.getSeconds() * 1000 -
      now.getMilliseconds();
    return timeToNextQuarterHour;
  };
  const setCurrentWorkoutIfExists = () => {
    const now = new Date();
    for (var [key, value] of Object.entries(user.plannedWorkouts)) {
      if (
        new Date(value[0].toDate().getTime() + value[1] * 60000) > now &&
        value[0].toDate() <= now
      ) {
        if (newWorkoutsAlerts[key] != null) {
          updateDoc(doc(db, `alerts/${user.id}`), {
            [`newWorkouts.${key}`]: deleteField(),
          });
        }

        firebase.getWorkout(key).then((returnedWorkout) => {
          if (returnedWorkout) setCurrentWorkout(returnedWorkout);
          else if (currentWorkout) {
            setCurrentWorkout(null);
            removeOldUnconfirmedFromPlannedWorkouts();
          }
        });
      }
    }
  };
  useEffect(() => {
    if (!userLoaded) return;
    setCurrentWorkoutIfExists();
    const timeout = setTimeout(() => {
      setCurrentWorkoutIfExists();
      const interval = setInterval(setCurrentWorkoutIfExists, 15 * 60 * 1000);
      return () => {
        clearInterval(interval);
      };
    }, getMsUntilNextQuarterHour());
    return () => {
      clearTimeout(timeout);
    };
  }, [user?.plannedWorkouts, userLoaded]);
  const removeOldUnconfirmedFromPlannedWorkouts = () => {
    updateDoc(doc(db, "users", user.id), {
      plannedWorkouts: removeBadPlannedWorkoutsAndReturnFixed(user),
    });
  };
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
