import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect } from "react";
import { db, addLeaderboardPoints } from "../services/firebase";
import { doc, increment, Timestamp, updateDoc } from "firebase/firestore";
import { getCurrentLocation } from "../services/geoService";
import { getDistance } from "geolib";
import * as appStyle from "../components/AppStyleSheet";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import useAuth from "../hooks/useAuth";
import useCurrentWorkout from "../hooks/useCurrentWorkout";
import { useState } from "react";
const ConfirmWorkoutScreen = () => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();
  const { setCurrentWorkout, currentWorkout } = useCurrentWorkout();
  const { user } = useAuth();
  const [confirmed, setConfirmed] = useState(false);
  const [workout, setWorkout] = useState();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("ConfirmWorkout");
    }, [])
  );
  const {
    default: MapView,
    Circle,
    PROVIDER_GOOGLE,
  } = require("react-native-maps");
  const { Marker } = require("../services/mapsService");
  useEffect(() => {
    if (!workout && currentWorkout) setWorkout(currentWorkout);
  }, [currentWorkout]);
  const confirmationPoints = 15;
  const getDistenceFromMe = async () => {
    const currentLocation = await getCurrentLocation();
    const distance = getDistance(workout.location, currentLocation);
    return distance;
  };
  const sameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };
  const checkConfirmation = async () => {
    const distance = await getDistenceFromMe();
    console.log(`ditance: ${distance}`);
    if (distance <= 150) {
      const newWorkoutArray = [
        workout.startingTime.toDate(),
        workout.minutes,
        true,
      ];
      const now = new Date();
      console.log("test");
      if (
        user.lastConfirmedWorkoutDate &&
        sameDay(user.lastConfirmedWorkoutDate.toDate(), now)
      )
        console.log("test2");
      else console.log("test3");
      //   await updateDoc(doc(db, `users/${user.id}`), {
      //     lastConfirmedWorkoutDate: Timestamp.now(),
      //     [`workouts.${workout.id}`]: { ...newWorkoutArray },
      //     totalPoints: increment(confirmationPoints),
      //   });
      // else
      //   await updateDoc(doc(db, `users/${user.id}`), {
      //     lastConfirmedWorkoutDate: Timestamp.now(),
      //     [`workouts.${workout.id}`]: { ...newWorkoutArray },
      //     streak: increment(1),
      //     totalPoints: increment(confirmationPoints),
      //   });
      // await addLeaderboardPoints(user, confirmationPoints);
      console.log("test6");
      setCurrentWorkout(null);
      console.log("test5");
      setConfirmed(true);
      console.log("test4");
      setTimeout(() => {
        console.log("Going back");
        navigation.goBack();
      }, 1000);
    } else {
      Alert.alert(
        `You are ${
          distance < 1000 ? `${distance} meters` : ` ${distance / 1000} km away`
        } away from the workout location, get closer`
      );
    }
  };
  return confirmed == true ? (
    <View style={safeAreaStyle()} className="justify-center">
      <Text
        className="rounded py-2 px-4 font-semibold text-xl"
        style={{
          backgroundColor: appStyle.color_primary,
          color: appStyle.color_on_primary,
        }}
      >
        Workout Confirmed! +15 points
      </Text>
    </View>
  ) : (
    <View
      className="items-center px-3 justify-center gap-y-3"
      style={safeAreaStyle()}
    >
      <Text
        className="rounded py-2 px-4 font-semibold text-xl"
        style={{
          backgroundColor: appStyle.color_primary,
          color: appStyle.color_on_primary,
        }}
      >
        Get inside the circle
      </Text>
      <View
        className="items-center justify-center p-2 rounded-lg w-full aspect-square"
        style={{
          backgroundColor: appStyle.color_primary,
        }}
      >
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          initialRegion={{
            latitude: workout.location.latitude,
            longitude: workout.location.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.02,
          }}
        >
          <Marker coordinate={workout.location} />
          <Circle
            center={workout.location}
            radius={100}
            fillColor={appStyle.color_circle_fill}
            strokeColor={appStyle.color_circle_border}
            zIndex={2}
            strokeWidth={2}
          />
        </MapView>
      </View>

      <TouchableOpacity
        className="rounded py-2 px-4"
        style={{ backgroundColor: appStyle.color_primary }}
        onPress={checkConfirmation}
      >
        <Text
          className="font-semibold text-lg"
          style={{
            color: appStyle.color_on_primary,
          }}
        >
          Confirm workout
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  map: {
    height: "100%",
    width: "100%",
  },
});
export default ConfirmWorkoutScreen;
