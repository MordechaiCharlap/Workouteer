import React, { createContext, useContext, useEffect, useState } from "react";
import * as firebase from "../services/firebase";
import useAuth from "./useAuth";
const CurrentWorkoutContext = createContext({});
export const CurrentWorkoutProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [intervalVal, setIntervalVal] = useState(null);
  const checkIfCurrentWorkout = async (now) => {
    console.log("checking if theres current workout");
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
    console.log("havent found current workout");
  };
  const clearIntervalFunc = () => {
    if (intervalVal != null) {
      clearInterval(intervalVal);
      setIntervalVal(null);
    }
  };
  useEffect(() => {
    clearIntervalFunc();
    const initialCheckCurrentWorkout = async () => {
      const now = new Date();
      const currentWorkoutReturned = await checkIfCurrentWorkout(now);
      if (!currentWorkoutReturned) {
        const lastQuarter = now.getMinutes() % 15;
        //16 so there wont be bug checking 16:15:89 workout at 16:15:75. prefer to check at 16:16:XX to make sure
        var nextCheck = new Date(now.getTime() + (16 - lastQuarter) * 60000);
        const interval = setInterval(async () => {
          const now = new Date();
          if (now > nextCheck) {
            nextCheck = new Date(nextCheck.getTime() + 15 * 60000);
            const currentWorkoutReturned = await checkIfCurrentWorkout(now);
            if (currentWorkoutReturned != null) {
              setCurrentWorkout(currentWorkoutReturned);
              console.log(`found current workout: ${currentWorkoutReturned}`);
            } else setCurrentWorkout(null);
          }
        }, 60000);
        setIntervalVal(interval);
        return () => {
          clearIntervalFunc();
        };
      } else {
        setCurrentWorkout(currentWorkoutReturned);
        console.log(`found current workout: ${currentWorkoutReturned}`);
      }
    };

    if (user) {
      initialCheckCurrentWorkout();
    }
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
