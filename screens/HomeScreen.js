import { View, Dimensions, Text } from "react-native";
import React, { useCallback, useEffect } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import HomeScreenButton from "../components/homeScreen/HomeScreenButton";
import * as appStyle from "../utils/appStyleSheet";
import {
  faClock,
  faPlus,
  faMagnifyingGlass,
  faUserGroup,
  faEnvelopeOpenText,
  faGamepad,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import useAlerts from "../hooks/useAlerts";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
import languageService from "../services/languageService";
import useAuth from "../hooks/useAuth";
import ConfirmCurrentWorkoutButton from "../components/homeScreen/ConfirmCurrentWorkoutButton";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import useCurrentWorkout from "../hooks/useCurrentWorkout";
import useResponsiveness from "../hooks/useResponsiveness";
import useAppData from "../hooks/useAppData";
import useFriendsWorkouts from "../hooks/useFriendsWorkouts";
import CustomButton from "../components/basic/CustomButton";
import CustomText from "../components/basic/CustomText";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
const HomeScreen = () => {
  const navigation = useNavigation();
  const { specs } = useAppData();
  const { setCurrentScreen } = useNavbarDisplay();
  const { setScreen } = useNavbarNavigation();
  const { user, initialLoading, setInitialLoading } = useAuth();
  const { friendsWorkouts } = useFriendsWorkouts();
  const { workoutRequestsAlerts, newWorkoutsAlerts, workoutInvitesAlerts } =
    useAlerts();
  const { currentWorkout } = useCurrentWorkout();
  const { windowHeight } = useResponsiveness();
  const buttonStyle = {
    button: {},
    iconColor: appStyle.color_primary,
    textColor: appStyle.color_on_surface_variant,
    backgroundColor: appStyle.color_surface_variant,
    size: windowHeight / 5.5,
    iconSize: windowHeight / 16.5,
    fontSize: windowHeight / 40,
  };
  const rowStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
  };
  const menuContainerStyle = {
    alignItems: "center",
    height: "80%",
    justifyContent: "space-between",
  };
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Home");
      setScreen("Home");
    }, [])
  );
  useEffect(() => {
    if (initialLoading) setInitialLoading(false);
  }, [initialLoading]);
  return (
    <View style={safeAreaStyle()} className="justify-center">
      <View style={menuContainerStyle}>
        <View style={rowStyle}>
          <HomeScreenButton
            buttonText={languageService[user.language].findWorkoutHomeBtn}
            style={buttonStyle}
            navigateScreen="SearchWorkouts"
            icon={faMagnifyingGlass}
          />
          <HomeScreenButton
            buttonText={languageService[user.language].createWorkoutHomeBtn}
            style={buttonStyle}
            navigateScreen="CreateWorkout"
            icon={faPlus}
          />
        </View>
        <View style={rowStyle}>
          <HomeScreenButton
            number={Object.keys(user.plannedWorkouts).length}
            alert={
              Object.keys(workoutRequestsAlerts).length > 0 ||
              Object.keys(newWorkoutsAlerts).length > 0
            }
            // alertNumber={
            //   Object.keys(workoutRequestsAlerts).length +
            //   Object.keys(newWorkoutsAlerts).length
            // }
            buttonText={languageService[user.language].futureWorkoutsHomeBtn}
            style={buttonStyle}
            navigateScreen="FutureWorkouts"
            icon={faClock}
          />
          <HomeScreenButton
            buttonText={languageService[user.language].workoutProgramsHomeBtn}
            style={buttonStyle}
            navigateScreen="WorkoutPrograms"
            icon={faFile}
          />
        </View>
        <View style={rowStyle}>
          <HomeScreenButton
            alert={friendsWorkouts.length > 0}
            alertNumber={friendsWorkouts.length}
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
        {/* {user.role == "admin" && (
          <View style={rowStyle}>
            <HomeScreenButton
              buttonText={"WorkoutPrograms"}
              style={buttonStyle}
              navigateScreen="WorkoutPrograms"
              icon={faFile}
            />
            <HomeScreenButton style={buttonStyle} spaceHolderButton={true} />
          </View>
        )} */}
      </View>
      {currentWorkout != null && (
        <ConfirmCurrentWorkoutButton
          currentWorkout={currentWorkout}
          user={user}
        />
      )}
      <View className="absolute top-0 right-0 left-0 flex-row justify-between p-1">
        {specs?.isBetaVersion && (
          <Text style={{ color: appStyle.color_primary }} className="text-xs">
            {languageService[user.language].betaVersion}
          </Text>
        )}
        {user?.role == "admin" && (
          <CustomButton
            onPress={() => {
              navigation.navigate("ControlPanel");
            }}
            style={{
              flexDirection: "row",
              backgroundColor: appStyle.color_primary,
            }}
          >
            <CustomText style={{ color: appStyle.color_on_primary }}>
              {languageService[user.language].controlPanel}
            </CustomText>
            <View style={{ width: 10 }} />
            <FontAwesomeIcon
              icon={faGamepad}
              color={appStyle.color_on_primary}
              size={20}
            />
          </CustomButton>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;
