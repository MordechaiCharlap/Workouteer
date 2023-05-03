import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import useAuth from "./useAuth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

const ConfirmedWorkoutContext = createContext({});
export const ConfirmedWorkoutsProvider = ({ children }) => {
  const { user } = useAuth();
  const [confirmedWorkouts, setConfirmedWorkouts] = useState();
  const [confirmedWorkoutsCount, setConfirmedWorkoutsCount] = useState();
  const [unsubscribeListener, setUnsubscribeListener] = useState();

  const cleanListener = () => {
    if (unsubscribeListener != null) {
      unsubscribeListener();
      setUnsubscribeListener(null);
    }
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
            setConfirmedWorkoutsCount(confirmedWorkoutsData.count);
          }
        );
        setUnsubscribeListener(unsubscribeConfirmedWorkouts);
      }
    }
    return () => cleanListener();
  }, [user]);
  return (
    <ConfirmedWorkoutContext.Provider
      value={{ confirmedWorkouts, confirmedWorkoutsCount }}
    >
      {children}
    </ConfirmedWorkoutContext.Provider>
  );
};
export default function useConfirmedWorkouts() {
  return useContext(ConfirmedWorkoutContext);
}
