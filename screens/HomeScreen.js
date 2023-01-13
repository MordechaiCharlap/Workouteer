import { View, TouchableOpacity, Text, StatusBar } from "react-native";
import React, { useCallback, useEffect, useLayoutEffect } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
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
const HomeScreen = () => {
  const navigation = useNavigation();

  const { workoutRequestsAlerts, newWorkoutsAlerts, workoutInvitesAlerts } =
    useAlerts();
  const { setScreen } = useNavbarNavigation();
  const { user } = useAuth();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const buttonStyle = {
    color: appStyle.color_on_primary,
    backgroundColor: appStyle.color_primary,
    iconSize: 40,
  };
  useFocusEffect(
    useCallback(() => {
      setScreen("Home");
    }, [])
  );
  return (
    <View style={style.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View className="flex-1 p-3 justify-center">
        <View className="flex-row justify-around my-5">
          <HomeScreenButton
            buttonText={languageService[user.language].findWorkout}
            style={buttonStyle}
            navigateScreen="FindWorkout"
            icon={faMagnifyingGlass}
          />
          <HomeScreenButton
            buttonText={languageService[user.language].createWorkout}
            style={buttonStyle}
            navigateScreen="NewWorkout"
            icon={faPlus}
          />
        </View>
        <View className="flex-row justify-around my-5">
          <HomeScreenButton
            alert={
              Object.keys(workoutRequestsAlerts).length > 0 ||
              Object.keys(newWorkoutsAlerts).length > 0
            }
            alertNumber={
              Object.keys(workoutRequestsAlerts).length +
              Object.keys(newWorkoutsAlerts).length
            }
            buttonText={languageService[user.language].futureWorkouts}
            style={buttonStyle}
            navigateScreen="FutureWorkouts"
            icon={faClock}
          />
          <HomeScreenButton
            buttonText={languageService[user.language].pastWorkouts}
            style={buttonStyle}
            navigateScreen="PastWorkouts"
            icon={faCalendarCheck}
          />
        </View>
        <View className="flex-row justify-around my-5">
          <HomeScreenButton
            buttonText={languageService[user.language].friendsWorkouts}
            style={buttonStyle}
            navigateScreen="FriendsWorkouts"
            icon={faUserGroup}
          />
          <HomeScreenButton
            alert={Object.keys(workoutInvitesAlerts).length > 0}
            alertNumber={Object.keys(workoutInvitesAlerts).length}
            buttonText={languageService[user.language].workoutInvites}
            style={buttonStyle}
            navigateScreen="WorkoutInvites"
            icon={faEnvelopeOpenText}
          />
        </View>
      </View>
      <BottomNavbar currentScreen="Home" />
    </View>
  );
};

export default HomeScreen;
