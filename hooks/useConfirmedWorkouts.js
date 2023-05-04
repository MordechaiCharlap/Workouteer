import { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { createContext } from "react";
import useAuth from "./useAuth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import * as firebase from "../services/firebase";

const ConfirmedWorkoutContext = createContext({});
export const ConfirmedWorkoutsProvider = ({ children }) => {
  const { user } = useAuth();
  const [confirmedWorkouts, setConfirmedWorkouts] = useState([]);
  const unsubscribeRef = useRef();
  const db = firebase.db;
  const cleanListener = () => {
    if (unsubscribeRef.current) {
      console.log("***Cleaning confirmedWorkoutsListener");
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  };
  const getConfirmedWorkoutsByUserId = async (userId) => {
    return (await getDoc(doc(db, `usersConfirmedWorkouts/${userId}`))).data()
      .confirmedWorkouts;
  };
  useEffect(() => {
    if (user && !unsubscribeRef.current) {
      console.log("Listening to confirmedWorkouts");
      unsubscribeRef.current = onSnapshot(
        doc(db, "usersConfirmedWorkouts", user.id),
        (doc) => {
          const confirmedWorkoutsData = doc.data();
          console.log("ConfirmedWorkouts updated!");
          console.log(confirmedWorkoutsData);
          if (confirmedWorkoutsData != null)
            setConfirmedWorkouts(confirmedWorkoutsData.confirmedWorkouts);
        }
      );
    }
  }, [user]);
  useEffect(() => {
    return () => {
      console.log("unmount");
      cleanListener();
    };
  }, []);
  return (
    <ConfirmedWorkoutContext.Provider
      value={{ confirmedWorkouts, getConfirmedWorkoutsByUserId }}
    >
      {children}
    </ConfirmedWorkoutContext.Provider>
  );
};
export default function useConfirmedWorkouts() {
  return useContext(ConfirmedWorkoutContext);
}
