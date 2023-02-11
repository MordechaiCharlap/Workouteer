import { View, StatusBar } from "react-native";
import React, { useCallback, useState } from "react";
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
import * as firebase from "../services/firebase";
import ConfirmCurrentWorkoutButton from "../components/ConfirmCurrentWorkoutButton";
const HomeScreen = () => {
  const { setScreen } = useNavbarNavigation();
  const { user } = useAuth();
  const { workoutRequestsAlerts, newWorkoutsAlerts, workoutInvitesAlerts } =
    useAlerts();

  const [currentWorkout, setCurrentWorkout] = useState();

  const buttonStyle = {
    color: appStyle.color_on_primary,
    backgroundColor: appStyle.color_primary,
    iconSize: 40,
  };
  const checkIfCurrentWorkout = async (now) => {
    console.log("checking if theres current workout");
    for (var [key, value] of Object.entries(user.workouts)) {
      if (
        new Date(value[0].toDate().getTime() + value[1] * 60000) > now &&
        value[0].toDate() < now &&
        !value[2]
      ) {
        console.log("found current workout");
        const workout = await firebase.getWorkout(key);

        return { ...workout, id: key };
      }
    }
    console.log("havent found current workout");
  };
  useFocusEffect(
    useCallback(() => {
      setScreen("Home");
      const initialCheckCurrentWorkout = async () => {
        const now = new Date();
        const currentWorkoutReturned = await checkIfCurrentWorkout(now);
        if (!currentWorkoutReturned) {
          const lastQuarter = now.getMinutes() % 15;
          //16 so there wont be bug checking 16:15:89 workout at 16:15:75. prefer to check at 16:16:XX to make sure
          var nextCheck = new Date(now.getTime() + (16 - lastQuarter) * 60000);
          const interval = setInterval(async () => {
            const now = new Date();
            if (now > nextCheck) {
              nextCheck = new Date(nextCheck.getTime() + 15 * 60000);
              const currentWorkoutReturned = await checkIfCurrentWorkout(now);
              if (currentWorkoutReturned != null) {
                setCurrentWorkout(currentWorkoutReturned);
              } else setCurrentWorkout(null);
            }
          }, 60000);
          return () => clearInterval(interval);
        } else {
          setCurrentWorkout(currentWorkoutReturned);
        }
      };
      initialCheckCurrentWorkout();
    }, [])
  );
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
