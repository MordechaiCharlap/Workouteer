import { View, Text, ScrollView } from "react-native";
import React from "react";
import useAuth from "../hooks/useAuth";
import useFirebase from "../hooks/useFirebase";
import { collection, limit, orderBy, query, where } from "firebase/firestore";

const Explore = () => {
  const { user } = useAuth();
  const { db } = useFirebase();
  const getLatestWorkouts = async () => {
    const latestWorkoutsQuery = query(
      collection(db, "workouts"),
      where(`members.${user.id}`, "==", null),
      where("isConfirmed", "==", true),
      orderBy("startingTime", "desc"),
      limit(30)
    );
  };
  return <ScrollView></ScrollView>;
};

export default Explore;
