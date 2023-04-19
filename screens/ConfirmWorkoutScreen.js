import { View, StyleSheet, Text } from "react-native";
import React, { useCallback } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { db, addLeaderboardPoints } from "../services/firebase";
import { doc, increment, Timestamp, updateDoc } from "firebase/firestore";
import { getCurrentLocation } from "../services/geoService";
import { getDistance } from "geolib";
import * as appStyle from "../components/AppStyleSheet";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
const ConfirmWorkoutScreen = ({ route }) => {
  const { setCurrentScreen } = useNavbarDisplay();
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
  const workoutLocation = route.params.workoutLocation;
  const confirmationPoints = 15;
  const confirmWorkoutLocation = async () => {
    const currentLocation = await getCurrentLocation();
    const distance = getDistance(
      props.currentWorkout.location,
      currentLocation
    );
    return distance;
  };
  const checkConfirmation = async () => {
    setLoading(true);
    if ((await confirmWorkoutLocation()) < 150) {
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
        "You are too far from the workout location. Try to get closer"
      );
    }

    setLoading(false);
  };
  return (
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
            latitude: workoutLocation.latitude,
            longitude: workoutLocation.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.02,
          }}
        >
          <Marker coordinate={workoutLocation} />
          <Circle
            center={workoutLocation}
            radius={100}
            fillColor={appStyle.color_circle_fill}
            strokeColor={appStyle.color_circle_border}
            zIndex={2}
            strokeWidth={2}
          />
        </MapView>
      </View>

      <TouchableOpacity onPress={checkConfirmation}>
        <Text>Confirm workout</Text>
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
