import { View, StatusBar, Dimensions } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
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
import useWebResponsiveness from "../hooks/useWebResponsiveness";
const HomeScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { setScreen } = useNavbarNavigation();
  const { user } = useAuth();
  const { workoutRequestsAlerts, newWorkoutsAlerts, workoutInvitesAlerts } =
    useAlerts();
  const { currentWorkout } = useCurrentWorkout();
  const { windowHeight } = useWebResponsiveness();
  const buttonStyle = {
    color: appStyle.color_on_primary,
    backgroundColor: appStyle.color_primary,
    size: windowHeight
      ? windowHeight / 5.5
      : Dimensions.get("window").height / 5.5,
    iconSize: windowHeight
      ? windowHeight / 16.5
      : Dimensions.get("window").height / 16.5,
    fontSize: windowHeight
      ? windowHeight / 35
      : Dimensions.get("window").height / 35,
  };
  const rowStyle = {
    flexDirection: "row",
    justifyContent: "center",
    columnGap: windowHeight
      ? windowHeight / 30
      : Dimensions.get("window").height / 30,
  };
  const menuContainerStyle = {
    flex: 1,
    paddingTop: windowHeight
      ? windowHeight / 25
      : Dimensions.get("window").height / 25,
    paddingBottom: windowHeight
      ? windowHeight / 25
      : Dimensions.get("window").height / 25,
    justifyContent: "space-evenly",
  };
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Home");
      setScreen("Home");
    }, [])
  );
  return (
    <View style={safeAreaStyle()}>
      <View></View>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View style={menuContainerStyle}>
        <View style={rowStyle}>
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
        <View style={rowStyle}>
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
        <View style={rowStyle}>
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
              user={user}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;
