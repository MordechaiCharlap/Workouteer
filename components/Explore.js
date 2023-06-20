import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
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
import useExplore from "../hooks/useExplore";

const Explore = () => {
  const { latestWorkouts, setLatestWorkouts } = useExplore();
  const refreshLatestWorkouts = async () => {
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
  return (
    <View>
      <View style={{ paddingHorizontal: 16 }}>
        <CustomButton
          onPress={refreshLatestWorkouts}
          className="self-start my-2"
          style={{ backgroundColor: appStyle.color_primary }}
        >
          <FontAwesomeIcon
            icon={faRotateRight}
            color={appStyle.color_on_primary}
            size={25}
          />
        </CustomButton>
      </View>
      <View>
        <FlatList
          style={[{ paddingHorizontal: 16 }]}
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
