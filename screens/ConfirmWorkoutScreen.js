import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
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
  const [checkingDistance, setCheckingDistance] = useState(false);
  const [updatingFirestore, setUpdatingFirestore] = useState(false);
  const workout = currentWorkout;
  const [refresh, setRefresh] = useState(true);
  useEffect(() => {
    if (refresh) {
      checkConfirmation();
      setRefresh(false);
    }
  }, [refresh]);

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
  const getDistanceWithTimeout = async () => {
    try {
      const result = await Promise.race([
        // Your async operation here
        getDistenceFromMe(),
        new Promise(
          (_, reject) =>
            setTimeout(() => reject(new Error("Timeout occurred")), 5000) // Timeout duration in milliseconds
        ),
      ]);
      // Handle successful result
      return result;
    } catch (error) {
      // Handle error or timeout
      // Refresh the page or perform other actions
      return null; // Return a default value or handle the error as appropriate for your use case
    }
  };
  const checkConfirmation = useCallback(async () => {
    setCheckingDistance(true);

    const distance = await getDistanceWithTimeout();
    if (distance == null) {
      setRefresh(true);
    }
    if (distance <= 150) {
      setUpdatingFirestore(true);
      setConfirmed(true);
      setCheckingDistance(false);
      const newWorkoutArray = [
        workout.startingTime.toDate(),
        workout.minutes,
        true,
      ];
      const now = new Date();
      if (
        user.lastConfirmedWorkoutDate &&
        sameDay(user.lastConfirmedWorkoutDate.toDate(), now)
      )
        await updateDoc(doc(db, `users/${user.id}`), {
          lastConfirmedWorkoutDate: Timestamp.now(),
          [`workouts.${workout.id}`]: { ...newWorkoutArray },
          totalPoints: increment(confirmationPoints),
        });
      else
        await updateDoc(doc(db, `users/${user.id}`), {
          lastConfirmedWorkoutDate: Timestamp.now(),
          [`workouts.${workout.id}`]: { ...newWorkoutArray },
          streak: increment(1),
          totalPoints: increment(confirmationPoints),
        });
      await addLeaderboardPoints(user, confirmationPoints);
      setUpdatingFirestore(false);
    } else {
      setConfirmed(false);
      setCheckingDistance(false);
      Alert.alert(
        `You are ${
          distance < 1000 ? `${distance} meters` : ` ${distance / 1000} km away`
        } away from the workout location, get closer`
      );
    }
  }, []);
  return confirmed == true ? (
    <View style={safeAreaStyle()} className="justify-center">
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      {updatingFirestore ? (
        <Text
          className="rounded py-2 px-4 font-semibold text-xl"
          style={{
            backgroundColor: appStyle.color_primary,
            color: appStyle.color_on_primary,
          }}
        >
          Workout Confirmed! Don't leave the screen while we updating your place
          on leaderboard
        </Text>
      ) : (
        <>
          <Text
            className="rounded py-2 px-4 font-semibold text-xl"
            style={{
              backgroundColor: appStyle.color_primary,
              color: appStyle.color_on_primary,
            }}
          >
            {confirmationPoints} points added succesfully!
          </Text>
          <TouchableOpacity
            className="rounded py-2 px-4"
            style={{ backgroundColor: appStyle.color_primary }}
            onPress={() => {
              navigation.goBack();
              setCurrentWorkout(null);
            }}
          >
            <Text
              className="font-semibold text-lg"
              style={{
                color: appStyle.color_on_primary,
              }}
            >
              Go back
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  ) : (
    <View
      className="items-center px-3 justify-center gap-y-3"
      style={safeAreaStyle()}
    >
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Text
        className="rounded py-2 px-4 font-semibold text-xl"
        style={{
          borderColor: appStyle.color_primary,
          borderWidth: 0.3,
          color: appStyle.color_primary,
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
        onPress={checkingDistance ? {} : checkConfirmation}
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
      {checkingDistance == true ? (
        <View className="absolute top-0 bottom-0 left-0 right-0 justify-center items-center">
          <Text
            className="rounded py-2 px-4 font-semibold text-xl text-center"
            style={{
              backgroundColor: appStyle.color_primary,
              color: appStyle.color_on_primary,
            }}
          >
            Checking distance...
          </Text>
        </View>
      ) : (
        <></>
      )}
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
