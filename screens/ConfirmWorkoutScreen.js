import {
  View,
  StyleSheet,
  Text,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import * as firebase from "../services/firebase";
import {
  arrayUnion,
  deleteField,
  doc,
  increment,
  Timestamp,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { getCurrentLocation } from "../services/geoService";
import { getDistance } from "geolib";
import * as appStyle from "../utilities/appStyleSheet";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import useAuth from "../hooks/useAuth";
import useCurrentWorkout from "../hooks/useCurrentWorkout";
import languageService from "../services/languageService";
import { useState } from "react";
import AwesomeAlert from "react-native-awesome-alerts";
import CustomText from "../components/basic/CustomText";
import CustomButton from "../components/basic/CustomButton";
import AwesomeModal from "../components/AwesomeModal";

const ConfirmWorkoutScreen = () => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();
  const { setCurrentWorkout, currentWorkout } = useCurrentWorkout();
  const { user } = useAuth();
  const db = firebase.db;
  const [confirmed, setConfirmed] = useState(false);
  const [checkingDistance, setCheckingDistance] = useState(false);
  const workout = currentWorkout;
  const [refresh, setRefresh] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [exitableAlert, setExitableAlert] = useState(true);
  useEffect(() => {
    const checkConfirmation = async () => {
      setCheckingDistance(true);

      const distance = await getDistanceWithTimeout();
      if (distance == null) {
        setRefresh(true);
      }
      if (distance <= 100) {
        setAlertTitle(
          languageService[user.language].workoutConfirmedDontLeave[
            user.isMale ? 1 : 0
          ]
        );
        setExitableAlert(false);
        setShowAlert(true);

        setCheckingDistance(false);
        const now = new Date();
        await updateDoc(doc(db, `usersConfirmedWorkouts/${user.id}`), {
          confirmedWorkouts: arrayUnion({
            id: workout.id,
            startingTime: workout.startingTime,
            minutes: workout.minutes,
          }),
        });
        await updateDoc(doc(db, `workouts/${workout.id}`), {
          [`members.${user.id}.confirmedWorkout`]: true,
        });
        await firebase.addLeaderboardPoints(user, confirmationPoints);
        if (
          user.lastConfirmedWorkoutDate &&
          sameDay(user.lastConfirmedWorkoutDate.toDate(), now)
        )
          await updateDoc(doc(db, `users/${user.id}`), {
            lastConfirmedWorkoutDate: Timestamp.now(),
            [`plannedWorkouts.${workout.id}`]: deleteField(),
            totalPoints: increment(confirmationPoints),
            workoutsCount: increment(1),
          });
        else
          await updateDoc(doc(db, `users/${user.id}`), {
            streak: increment(1),
            lastConfirmedWorkoutDate: Timestamp.now(),
            [`plannedWorkouts.${workout.id}`]: deleteField(),
            totalPoints: increment(confirmationPoints),
            workoutsCount: increment(1),
          });

        setConfirmed(true);
        setShowAlert(false);
        setExitableAlert(false);
      } else {
        setConfirmed(false);
        setCheckingDistance(false);
        setAlertTitle(
          `${languageService[user.language].youAre[user.isMale ? 1 : 0]} ${
            distance < 1000
              ? `${distance} ${languageService[user.language].meters}`
              : ` ${distance / 1000} ${languageService[user.language].kms}`
          } ${
            languageService[user.language].fromTheWorkoutLocationGetCloser[
              user.isMale ? 1 : 0
            ]
          }`
        );
        setExitableAlert(true);
        setShowAlert(true);
      }
    };
    if (refresh) {
      checkConfirmation();
      setRefresh(false);
    }
  }, [refresh]);
  const checkConfirmation = async () => {
    setCheckingDistance(true);

    const distance = await getDistanceWithTimeout();
    if (distance == null) {
      setRefresh(true);
    }
    if (distance <= 100) {
      setAlertTitle(
        languageService[user.language].workoutConfirmedDontLeave[
          user.isMale ? 1 : 0
        ]
      );
      setExitableAlert(false);
      setShowAlert(true);

      setCheckingDistance(false);
      const now = new Date();
      await updateDoc(doc(db, `usersConfirmedWorkouts/${user.id}`), {
        confirmedWorkouts: arrayUnion({
          id: workout.id,
          startingTime: workout.startingTime,
          minutes: workout.minutes,
        }),
      });
      await updateDoc(doc(db, `workouts/${workout.id}`), {
        [`members.${user.id}.confirmedWorkout`]: true,
      });
      await firebase.addLeaderboardPoints(user, confirmationPoints);
      if (
        user.lastConfirmedWorkoutDate &&
        sameDay(user.lastConfirmedWorkoutDate.toDate(), now)
      )
        await updateDoc(doc(db, `users/${user.id}`), {
          lastConfirmedWorkoutDate: Timestamp.now(),
          [`plannedWorkouts.${workout.id}`]: deleteField(),
          totalPoints: increment(confirmationPoints),
          workoutsCount: increment(1),
        });
      else
        await updateDoc(doc(db, `users/${user.id}`), {
          streak: increment(1),
          lastConfirmedWorkoutDate: Timestamp.now(),
          [`plannedWorkouts.${workout.id}`]: deleteField(),
          totalPoints: increment(confirmationPoints),
          workoutsCount: increment(1),
        });

      setConfirmed(true);
      setShowAlert(false);
      setExitableAlert(false);
    } else {
      setConfirmed(false);
      setCheckingDistance(false);
      setAlertTitle(
        `${languageService[user.language].youAre} ${
          distance < 1000
            ? `${distance} ${languageService[user.language].meters}`
            : ` ${distance / 1000} ${languageService[user.language].kms}`
        } ${
          languageService[user.language].fromTheWorkoutLocationGetCloser[
            user.isMale ? 1 : 0
          ]
        }`
      );
      setExitableAlert(true);
      setShowAlert(true);
    }
  };
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
  return confirmed == true || workout == null ? (
    <View style={safeAreaStyle()} className="justify-center">
      <View className="items-center gap-y-7">
        <Text
          className="rounded p-2 font-semibold text-xl text-center"
          style={{
            backgroundColor: appStyle.color_primary,
            color: appStyle.color_on_primary,
          }}
        >
          {confirmationPoints} {languageService[user.language].pointsAdded}
        </Text>
        <CustomButton
          style={{
            backgroundColor: appStyle.color_on_background,
            borderRadius: 999,
            paddingHorizontal: 16,
          }}
          onPress={() => {
            navigation.goBack();
            setCurrentWorkout(null);
          }}
        >
          <CustomText
            className="font-semibold text-lg text-center"
            style={{
              color: appStyle.color_background,
            }}
          >
            {languageService[user.language].exit}
          </CustomText>
        </CustomButton>
      </View>
    </View>
  ) : (
    <View
      className="items-center px-3 justify-center gap-y-3"
      style={safeAreaStyle()}
    >
      <CustomText
        className="rounded py-2 px-4 font-semibold text-xl"
        style={{
          color: appStyle.color_on_background,
        }}
      >
        {languageService[user.language].getInsideTheCircle[user.isMale ? 1 : 0]}
      </CustomText>
      <View
        className="items-center justify-center p-2 rounded-lg w-full aspect-square"
        style={{
          backgroundColor: appStyle.color_outline,
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

      <CustomButton
        style={{
          backgroundColor: appStyle.color_on_background,
          borderRadius: 999,
          paddingHorizontal: 16,
        }}
        onPress={async () =>
          checkingDistance ? {} : await checkConfirmation()
        }
      >
        <CustomText
          className="font-semibold text-lg"
          style={{
            color: appStyle.color_background,
          }}
        >
          {languageService[user.language].confirmWorkout[user.isMale ? 1 : 0]}
        </CustomText>
      </CustomButton>
      {checkingDistance == true ? (
        <View className="absolute top-0 bottom-0 left-0 right-0 justify-center items-center">
          <Text
            className="rounded py-2 px-4 font-semibold text-xl text-center"
            style={{
              backgroundColor: appStyle.color_primary,
              color: appStyle.color_on_primary,
            }}
          >
            {languageService[user.language].checkingDistance + "..."}
          </Text>
        </View>
      ) : (
        <></>
      )}
      <AwesomeModal
        showModal={showAlert}
        showProgress={!exitableAlert}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={exitableAlert}
        closeOnHardwareBackPress={true}
        onDismiss={() => setShowAlert(false)}
        showConfirmButton={exitableAlert}
        confirmText={languageService[user.language].gotIt}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
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
