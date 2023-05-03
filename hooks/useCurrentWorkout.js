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
  const hasRunEffectRef = useRef(false);
  const clearIntervalFunc = () => {
    if (intervalRef.current != false) {
      console.log("Clearing interval");
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      hasRunEffectRef.current = false;
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
      const msUntilNextQuarterPlusOneSec = millisecondsUntilQuarterHour + 1000;
      // Wait until the next quarter hour to start the interval
      setTimeout(async () => {
        console.log("initial interval");
        setCurrentWorkout(await checkIfCurrentWorkout());
        const interval = setInterval(async () => {
          setCurrentWorkout(await checkIfCurrentWorkout());
        }, 15 * 60 * 1000);
        intervalRef.current = interval;
      }, msUntilNextQuarterPlusOneSec);
    };

    clearIntervalFunc();
    if (user && !hasRunEffectRef.current) {
      console.log("initialCheck");
      initialCheckCurrentWorkout();
      hasRunEffectRef.current = true;
    }
    return () => clearIntervalFunc();
  }, [user.plannedWorkouts]);
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
