import { View, StatusBar, Dimensions, Text } from "react-native";
import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import HomeScreenButton from "../components/HomeScreenButton";
import * as appStyle from "../utilities/appStyleSheet";
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
import useAppData from "../hooks/useAppData";
const HomeScreen = () => {
  const { appData } = useAppData();
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
    justifyContent: "space-between",
  };
  const menuContainerStyle = {
    marginTop: windowHeight
      ? windowHeight / 16.5
      : Dimensions.get("window").height / 16.5,
    width: "85%",
    height: "80%",
    justifyContent: "space-between",
  };
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Home");
      setScreen("Home");
    }, [])
  );
  return (
    <View style={safeAreaStyle()}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View style={menuContainerStyle} className="self-center">
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
      </View>
      {currentWorkout != null && (
        <View style={{ width: "85%" }} className="justify-center">
          <ConfirmCurrentWorkoutButton
            currentWorkout={currentWorkout}
            user={user}
          />
        </View>
      )}
      {appData.isBetaVersion && (
        <Text
          style={{ color: appStyle.color_primary }}
          className="absolute text-xs m-1"
        >
          {languageService[user.language].betaVersion}
        </Text>
      )}
    </View>
  );
};

export default HomeScreen;
