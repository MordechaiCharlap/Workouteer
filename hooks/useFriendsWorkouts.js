import React, { createContext, useContext, useEffect, useState } from "react";
import * as firebase from "../services/firebase";
import useAuth from "./useAuth";
const FriendsWorkoutsContext = createContext({});
export const FriendsWorkoutsProvider = ({ children }) => {
  const [friendsWorkouts, setFriendsWorkouts] = useState();
  const { user } = useAuth();
  useEffect(() => {
    if (user != null && friendsWorkouts == null) {
      const initialGetAllFriendsWorkout = async () => {
        const friendsWorkoutsArray = await firebase.getFriendsWorkouts(user);
        setFriendsWorkouts(friendsWorkoutsArray);
      };
      initialGetAllFriendsWorkout();
    }
  }, [user]);

  return (
    <FriendsWorkoutsContext.Provider
      value={{ friendsWorkouts, setFriendsWorkouts }}
    >
      {children}
    </FriendsWorkoutsContext.Provider>
  );
};
export default function useFriendsWorkouts() {
  return useContext(FriendsWorkoutsContext);
}
