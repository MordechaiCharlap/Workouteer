import { View, Text, ScrollView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useFirebase from "../hooks/useFirebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import CustomButton from "./basic/CustomButton";
import * as appStyle from "../utilities/appStyleSheet";
import WorkoutComponent from "./WorkoutComponent";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

const Explore = () => {
  const [latestWorkouts, setLatestWorkouts] = useState([]);
  const { user } = useAuth();
  const { db } = useFirebase();
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
  useEffect(() => {
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
  }, []);

  return (
    <View>
      <CustomButton
        onPress={getLatestWorkouts}
        className="self-center"
        style={{ backgroundColor: appStyle.color_primary, margin: 16 }}
      >
        <FontAwesomeIcon
          icon={faRotateRight}
          color={appStyle.color_on_primary}
          size={30}
        />
      </CustomButton>
      <View>
        <FlatList
          data={latestWorkouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WorkoutComponent workout={item} isPastWorkout={true} />
          )}
        />
      </View>
    </View>
  );
};

export default Explore;
