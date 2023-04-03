import { View, StatusBar } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import style from "../components/ResponsiveStyling";
import HomeScreenButton from "../components/HomeScreenButton";
import * as appStyle from "../components/AppStyleSheet";
import {
  faClock,
  faPlus,
  faMagnifyingGlass,
  faUserGroup,
  faCalendarCheck,
  faEnvelopeOpenText,
} from "@fortawesome/free-solid-svg-icons";
import useAlerts from "../hooks/useAlerts";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
import languageService from "../services/languageService";
import useAuth from "../hooks/useAuth";
import ConfirmCurrentWorkoutButton from "../components/ConfirmCurrentWorkoutButton";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import useCurrentWorkout from "../hooks/useCurrentWorkout";
const HomeScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { setScreen } = useNavbarNavigation();
  const { user } = useAuth();
  const { workoutRequestsAlerts, newWorkoutsAlerts, workoutInvitesAlerts } =
    useAlerts();
  const { currentWorkout } = useCurrentWorkout();

  const buttonStyle = {
    color: appStyle.color_on_primary,
    backgroundColor: appStyle.color_primary,
    iconSize: 40,
  };

  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Home");
      setScreen("Home");
    }, [])
  );
  // useEffect(() => {
  //   const getFasterikoData = async () => {
  //     console.log("trying to get data");
  //     const userRef = await firestore()
  //       .collection("users")
  //       .doc("fasteriko")
  //       .get();
  //     console.log("data: " + userRef.data());
  //   };
  //   getFasterikoData();
  // }, []);
  return (
    <View style={style.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View className="flex-1 p-3 px-7 justify-center">
        <View className="flex-row justify-between my-5">
          <HomeScreenButton
            buttonText={languageService[user.language].findWorkoutHomeBtn}
            style={buttonStyle}
            navigateScreen="FindWorkout"
            icon={faMagnifyingGlass}
          />
          <HomeScreenButton
            buttonText={languageService[user.language].createWorkoutHomeBtn}
            style={buttonStyle}
            navigateScreen="NewWorkout"
            icon={faPlus}
          />
        </View>
        <View className="flex-row justify-between my-5">
          <HomeScreenButton
            alert={
              Object.keys(workoutRequestsAlerts).length > 0 ||
              Object.keys(newWorkoutsAlerts).length > 0
            }
            alertNumber={
              Object.keys(workoutRequestsAlerts).length +
              Object.keys(newWorkoutsAlerts).length
            }
            buttonText={languageService[user.language].futureWorkoutsHomeBtn}
            style={buttonStyle}
            navigateScreen="FutureWorkouts"
            icon={faClock}
          />
          <HomeScreenButton
            buttonText={languageService[user.language].pastWorkoutsHomeBtn}
            style={buttonStyle}
            navigateScreen="PastWorkouts"
            icon={faCalendarCheck}
          />
        </View>
        <View className="flex-row justify-between my-5">
          <HomeScreenButton
            buttonText={languageService[user.language].friendsWorkoutsHomeBtn}
            style={buttonStyle}
            navigateScreen="FriendsWorkouts"
            icon={faUserGroup}
          />
          <HomeScreenButton
            alert={Object.keys(workoutInvitesAlerts).length > 0}
            alertNumber={Object.keys(workoutInvitesAlerts).length}
            buttonText={languageService[user.language].workoutInvitesHomeBtn}
            style={buttonStyle}
            navigateScreen="WorkoutInvites"
            icon={faEnvelopeOpenText}
          />
        </View>

        {currentWorkout != null && (
          <View className="absolute bottom-1 right-0 left-0 mx-0 items-center">
            <ConfirmCurrentWorkoutButton
              currentWorkout={currentWorkout}
              userId={user.id}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;
