import { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { createContext } from "react";
import useAuth from "./useAuth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import useFirebase from "./useFirebase";
const ConfirmedWorkoutContext = createContext({});
export const ConfirmedWorkoutsProvider = ({ children }) => {
  const { user, userLoaded } = useAuth();
  const [confirmedWorkouts, setConfirmedWorkouts] = useState([]);
  const unsubscribeRef = useRef();
  const { db } = useFirebase();
  const cleanListener = () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  };
  const getConfirmedWorkoutsByUserId = async (userId) => {
    return (await getDoc(doc(db, `usersConfirmedWorkouts/${userId}`))).data()
      .confirmedWorkouts;
  };
  useEffect(() => {
    if (userLoaded) {
      unsubscribeRef.current = onSnapshot(
        doc(db, "usersConfirmedWorkouts", user.id),
        (doc) => {
          const confirmedWorkoutsData = doc.data();
          if (confirmedWorkoutsData != null)
            setConfirmedWorkouts(confirmedWorkoutsData.confirmedWorkouts);
        }
      );
    } else cleanListener();
    return () => {
      cleanListener();
    };
  }, [userLoaded]);
  return (
    <ConfirmedWorkoutContext.Provider
      value={{
        confirmedWorkouts,
        getConfirmedWorkoutsByUserId,
      }}
    >
      {children}
    </ConfirmedWorkoutContext.Provider>
  );
};
export default function useConfirmedWorkouts() {
  return useContext(ConfirmedWorkoutContext);
}
