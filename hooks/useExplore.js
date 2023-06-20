import { createContext, useContext, useEffect, useState } from "react";
import useAuth from "./useAuth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import useFirebase from "./useFirebase";

const ExploreContext = createContext({});
export const ExploreProvider = ({ children }) => {
  const { user, userLoaded } = useAuth();
  const { db } = useFirebase();
  const [latestWorkouts, setLatestWorkouts] = useState();

  useEffect(() => {
    if (!userLoaded) return;

    const getLatestWorkouts = async () => {
      const data = [];
      const q = query(
        collection(db, "workouts"),
        where("confirmed", "==", true),
        orderBy("startingTime", "desc"),
        limit(10)
      );
      (await getDocs(q)).forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setLatestWorkouts(data);
    };
    getLatestWorkouts();
  }, [userLoaded]);
  return (
    <ExploreContext.Provider value={{ latestWorkouts, setLatestWorkouts }}>
      {children}
    </ExploreContext.Provider>
  );
};
export default function useExplore() {
  return useContext(ExploreContext);
}
