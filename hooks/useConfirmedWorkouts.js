import { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { createContext } from "react";
import useAuth from "./useAuth";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import useFirebase from "./useFirebase";
const ConfirmedWorkoutContext = createContext({});
export const ConfirmedWorkoutsProvider = ({ children }) => {
  const { user, userLoaded } = useAuth();
  const [confirmedWorkouts, setConfirmedWorkouts] = useState([]);
  const unsubscribeRef = useRef();
  const { db } = useFirebase();
  const cleanConfirmedWorkoutsListener = () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;

      setConfirmedWorkouts([]);
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
        (docSnap) => {
          if (docSnap.exists())
            setConfirmedWorkouts(docSnap.data().confirmedWorkouts);
          else {
            setDoc(doc(db, "usersConfirmedWorkouts", user.id), {
              confirmedWorkouts: [],
            });
          }
        }
      );
    } else {
      cleanConfirmedWorkoutsListener();
    }
    return () => {
      cleanConfirmedWorkoutsListener();
    };
  }, [userLoaded]);
  return (
    <ConfirmedWorkoutContext.Provider
      value={{
        confirmedWorkouts,
        getConfirmedWorkoutsByUserId,
        cleanConfirmedWorkoutsListener,
      }}
    >
      {children}
    </ConfirmedWorkoutContext.Provider>
  );
};
export default function useConfirmedWorkouts() {
  return useContext(ConfirmedWorkoutContext);
}
