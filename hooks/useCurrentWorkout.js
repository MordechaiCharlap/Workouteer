import React, { createContext, useContext, useEffect, useState } from "react";
import * as firebase from "../services/firebase";
import useAuth from "./useAuth";
const CurrentWorkoutContext = createContext({});
export const CurrentWorkoutProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [intervalVal, setIntervalVal] = useState(null);
  const checkIfCurrentWorkout = async (now) => {
    console.log(`checking if theres current workout for ${now.toDateString()}`);
    for (var [key, value] of Object.entries(user.workouts)) {
      if (
        new Date(value[0].toDate().getTime() + value[1] * 60000) > now &&
        value[0].toDate() < now &&
        !value[2]
      ) {
        const workout = await firebase.getWorkout(key);

        return { ...workout, id: key };
      }
    }
  };
  const clearIntervalFunc = () => {
    if (intervalVal != null) {
      console.log("Clearing interval");
      clearInterval(intervalVal);
      setIntervalVal(null);
    }
  };
  useEffect(() => {
    clearIntervalFunc();

    const initialCheckCurrentWorkout = async () => {
      // Get the current time
      const now = new Date();

      // Call the function immediately on the initial render
      checkIfCurrentWorkout(now);

      // Calculate the number of minutes past the hour
      const minutes = now.getMinutes();

      // Calculate the number of minutes until the next quarter hour
      const minutesUntilQuarterHour = 15 - (minutes % 15);

      // Calculate the number of milliseconds until the next quarter hour
      const millisecondsUntilQuarterHour = minutesUntilQuarterHour * 60 * 1000;
      //Adding second so it would calculate the workouts which registered exactly at 00:00 (ss,ms)
      const msUntilNextQuarterPlusOneSec = millisecondsUntilQuarterHour + 1000;
      // Wait until the next quarter hour to start the interval
      setTimeout(() => {
        console.log("initial interval");
        const now = new Date();
        checkIfCurrentWorkout(now);
        const interval = setInterval(() => {
          const now = new Date();
          checkIfCurrentWorkout(now);
        }, 15 * 60 * 1000);
        setIntervalVal(interval);
      }, msUntilNextQuarterPlusOneSec);
    };

    if (user) {
      console.log("initialCheck");
      initialCheckCurrentWorkout();
    }

    return () => {
      clearIntervalFunc();
    };
  }, [user?.workouts]);
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
