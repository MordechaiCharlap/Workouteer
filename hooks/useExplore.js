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
  const [refreshing, setRefreshing] = useState(false);

  const getLatestWorkouts = () => {
    const data = [];
    const q = query(
      collection(db, "workouts"),
      where("confirmed", "==", true),
      orderBy("startingTime", "desc"),
      limit(10)
    );
    getDocs(q).then((snapshot) => {
      snapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setLatestWorkouts(data);
    });
  };
  useEffect(() => {
    if (!userLoaded) return;

    getLatestWorkouts();
  }, [userLoaded]);
  const refreshLatestWorkouts = () => {
    setRefreshing(true);
    const data = [];
    const q = query(
      collection(db, "workouts"),
      where("confirmed", "==", true),
      orderBy("startingTime", "desc"),
      limit(10)
    );
    getDocs(q).then((snapshot) => {
      snapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setLatestWorkouts(data);
      setRefreshing(false);
    });
  };
  return (
    <ExploreContext.Provider
      value={{ latestWorkouts, refreshLatestWorkouts, refreshing }}
    >
      {children}
    </ExploreContext.Provider>
  );
};
export default function useExplore() {
  return useContext(ExploreContext);
}
