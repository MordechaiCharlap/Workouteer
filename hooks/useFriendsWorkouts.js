import React, { createContext, useContext, useEffect, useState } from "react";
import * as firebase from "../services/firebase";
import useAuth from "./useAuth";
const FriendsWorkoutsContext = createContext({});
export const FriendsWorkoutsProvider = ({ children }) => {
  const [friendsWorkouts, setFriendsWorkouts] = useState([]);
  return (
    <FriendsWorkoutsContext.Provider value={{}}>
      {children}
    </FriendsWorkoutsContext.Provider>
  );
};
export default function useFriendsWorkouts() {
  return useContext(FriendsWorkoutsContext);
}
