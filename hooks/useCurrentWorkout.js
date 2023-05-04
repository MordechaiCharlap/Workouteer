import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import * as firebase from "../services/firebase";
import useAuth from "./useAuth";
const CurrentWorkoutContext = createContext({});
export const CurrentWorkoutProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const clearIntervalOrTimeoutFunc = () => {
    console.log("Clearing intervalOrTimeout func");
    if (intervalRef.current != null) {
      console.log("Clearing interval");
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current != null) {
      console.log("Clearing timeout");
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  useEffect(() => {
    const checkIfCurrentWorkout = async () => {
      const now = new Date();
      console.log(
        `checking if theres current workout for ${now.toTimeString()}`
      );
      console.log(
        `there is ${Object.keys(user.plannedWorkouts).length} workouts to check`
      );
      for (var [key, value] of Object.entries(user.plannedWorkouts)) {
        console.log(
          `checking ${key} starting time: ${value[0].toDate().toTimeString()}`
        );
        if (
          new Date(value[0].toDate().getTime() + value[1] * 60000) > now &&
          value[0].toDate() < now
        ) {
          console.log(`current:${key}`);
          const workout = await firebase.getWorkout(key);

          return { ...workout, id: key };
        }
      }
      console.log("Havent found current workout");
    };
    const initialCheckCurrentWorkout = async () => {
      console.log("=== Initial check");
      // Get the current time
      const now = new Date();

      // Call the function immediately on the initial render
      setCurrentWorkout(await checkIfCurrentWorkout(now));

      // Calculate the number of minutes past the hour
      const minutes = now.getMinutes();

      // Calculate the number of minutes until the next quarter hour
      const minutesUntilQuarterHour = 15 - (minutes % 15);

      // Calculate the number of milliseconds until the next quarter hour
      const millisecondsUntilQuarterHour = minutesUntilQuarterHour * 60 * 1000;
      //Adding second so it would calculate the workouts which registered exactly at 00:00 (ss,ms)
      // Wait until the next quarter hour to start the interval
      timeoutRef.current = setTimeout(async () => {
        console.log("=== FinishedTimeout: second check");
        timeoutRef.current = null;
        setCurrentWorkout(await checkIfCurrentWorkout());
        intervalRef.current = setInterval(async () => {
          console.log("=== finished 15 minutes interval: third check");

          setCurrentWorkout(await checkIfCurrentWorkout());
        }, 15 * 60 * 1000);
      }, millisecondsUntilQuarterHour);
    };

    clearIntervalOrTimeoutFunc();
    if (user) {
      initialCheckCurrentWorkout();
    }
  }, [user.plannedWorkouts]);
  useEffect(() => {
    console.log("unmount");
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
