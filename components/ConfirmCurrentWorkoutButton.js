import { View, Text, TouchableOpacity } from "react-native";
import { workoutTypes } from "./WorkoutType";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as appStyle from "../components/AppStyleSheet";
import { db } from "../services/firebase";
import { doc, updateDoc } from "firebase/firestore";
const ConfirmCurrentWorkoutButton = (props) => {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const confirmWorkout = async () => {
    setLoading(true);
    const newWorkoutArray = [
      props.currentWorkout.startingTime.toDate(),
      props.currentWorkout.minutes,
      true,
    ];
    await updateDoc(doc(db, `users/${props.userId}`), {
      [`workouts.${props.currentWorkout.id}`]: { ...newWorkoutArray },
    });
    setConfirmed(true);
    setLoading(false);
  };
  return (
    <View className="w-2/3">
      <TouchableOpacity
        onPress={!loading && !confirmed ? async () => confirmWorkout() : {}}
        className="rounded-full p-2 flex-row items-center w-full justify-evenly"
        style={{
          borderWidth: 2,
          borderColor: appStyle.color_on_primary,
          backgroundColor: appStyle.color_bg_variant,
        }}
      >
        <View
          className="rounded-full p-2"
          style={{
            borderWidth: 0.5,
            borderColor: appStyle.color_on_primary,
            backgroundColor: appStyle.color_primary,
          }}
        >
          <FontAwesomeIcon
            icon={workoutTypes[props.currentWorkout.type].icon}
            size={30}
            color={appStyle.color_on_primary}
          />
        </View>
        <Text style={{ color: appStyle.color_on_primary }}>
          {loading
            ? "Loading"
            : !loading && !confirmed
            ? "Confirm workout to get points"
            : "Workout confirmed"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmCurrentWorkoutButton;
