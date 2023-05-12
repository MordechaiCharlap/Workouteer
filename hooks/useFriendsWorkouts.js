import React, { createContext, useContext, useEffect, useState } from "react";
import * as firebase from "../services/firebase";
import useAuth from "./useAuth";
const FriendsWorkoutsContext = createContext({});
export const FriendsWorkoutsProvider = ({ children }) => {
  const [friendsWorkouts, setFriendsWorkouts] = useState([]);
  const { user } = useAuth();
  const updateArrayIfNeedForWorkout = (updatedWorkout) => {
    const workoutIndex = friendsWorkouts.findIndex(
      (workout) => updatedWorkout.id == workout.id
    );
    if (workoutIndex == -1) return;
    const arrayClone = friendsWorkouts.slice();
    arrayClone[workoutIndex] = updatedWorkout;
    setFriendsWorkouts(arrayClone);
  };
  useEffect(() => {
    if (user == null) return;
    const initialGetAllFriendsWorkout = async () => {
      const friendsWorkoutsArray = await firebase.getFriendsFutureWorkouts(
        user
      );
      setFriendsWorkouts(friendsWorkoutsArray);
    };
    initialGetAllFriendsWorkout();
  }, [user?.plannedWorkouts]);

  return (
    <FriendsWorkoutsContext.Provider
      value={{
        friendsWorkouts,
        setFriendsWorkouts,
        updateArrayIfNeedForWorkout,
      }}
    >
      {children}
    </FriendsWorkoutsContext.Provider>
  );
};
export default function useFriendsWorkouts() {
  return useContext(FriendsWorkoutsContext);
}
