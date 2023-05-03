import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import useAuth from "./useAuth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import * as firebase from "../services/firebase";

const ConfirmedWorkoutContext = createContext({});
export const ConfirmedWorkoutsProvider = ({ children }) => {
  const { user } = useAuth();
  const [confirmedWorkouts, setConfirmedWorkouts] = useState();
  const [unsubscribeListener, setUnsubscribeListener] = useState();
  const db = firebase.db;
  const cleanListener = () => {
    if (unsubscribeListener != null) {
      unsubscribeListener();
      setUnsubscribeListener(null);
    }
  };
  const getConfirmedWorkoutsByUserId = async (userId) => {
    return (await getDoc(doc(db, `usersConfirmedWorkouts/${userId}`))).data()
      .confirmedWorkouts;
  };
  useEffect(() => {
    if (user) {
      if (confirmedWorkouts == null) {
        console.log("Listening to confirmedWorkouts");
        const unsubscribeConfirmedWorkouts = onSnapshot(
          doc(db, "alerts", user.id),
          (doc) => {
            const confirmedWorkoutsData = doc.data();
            setConfirmedWorkouts(confirmedWorkoutsData.confirmedWorkouts);
          }
        );
        setUnsubscribeListener(unsubscribeConfirmedWorkouts);
      }
    }
    return () => cleanListener();
  }, [user]);
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
