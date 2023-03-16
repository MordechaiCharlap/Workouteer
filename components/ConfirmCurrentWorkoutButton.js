import { View, Text, TouchableOpacity, Alert } from "react-native";
import { workoutTypes } from "./WorkoutType";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as appStyle from "../components/AppStyleSheet";
import { db, addLeaderboardPoints } from "../services/firebase";
import { doc, increment, Timestamp, updateDoc } from "firebase/firestore";
import useAuth from "../hooks/useAuth";
import { getCurrentLocation } from "../services/geoService";
import { getDistance } from "geolib";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
const ConfirmCurrentWorkoutButton = (props) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const confirmationPoints = 15;
  const confirmWorkoutLocation = async () => {
    const currentLocation = await getCurrentLocation();
    const distance = getDistance(
      props.currentWorkout.location,
      currentLocation
    );
    return distance;
  };
  const confirmWorkout = async () => {
    setLoading(true);
    if ((await confirmWorkoutLocation()) < 100) {
      const newWorkoutArray = [
        props.currentWorkout.startingTime.toDate(),
        props.currentWorkout.minutes,
        true,
      ];
      const now = new Date();

      if (
        user.lastConfirmedWorkoutDate &&
        user.lastConfirmedWorkoutDate.toDate().toDateString() ==
          now.toDateString()
      )
        await updateDoc(doc(db, `users/${user.id}`), {
          lastConfirmedWorkoutDate: Timestamp.now(),
          [`workouts.${props.currentWorkout.id}`]: { ...newWorkoutArray },
          totalPoints: increment(confirmationPoints),
        });
      else
        await updateDoc(doc(db, `users/${user.id}`), {
          lastConfirmedWorkoutDate: Timestamp.now(),
          [`workouts.${props.currentWorkout.id}`]: { ...newWorkoutArray },
          streak: increment(1),
          totalPoints: increment(confirmationPoints),
        });
      await addLeaderboardPoints(user, confirmationPoints);

      setConfirmed(true);
    } else {
      Alert.alert(
        "You are to far from the workout location. Try to get closer"
      );
    }

    setLoading(false);
  };
  return (
    <View className="w-3/4">
      <TouchableOpacity
        onPress={!loading && !confirmed ? async () => confirmWorkout() : {}}
        className="rounded-full p-2 flex-row items-center w-full"
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
        <View className="flex-row flex-grow justify-center items-center">
          <Text style={{ color: appStyle.color_on_primary }}>
            {loading
              ? "Loading"
              : !loading && !confirmed
              ? "Confirm workout to get points"
              : "Workout confirmed"}
          </Text>
          {!loading && confirmed && (
            <FontAwesomeIcon
              icon={faCheck}
              size={15}
              color={appStyle.color_on_primary}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmCurrentWorkoutButton;
