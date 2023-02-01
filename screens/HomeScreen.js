import { View, TouchableOpacity, Text, StatusBar } from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
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
import * as firebase from "../services/firebase";
const HomeScreen = () => {
  const navigation = useNavigation();
  const { setScreen } = useNavbarNavigation();
  const { user } = useAuth();
  const { workoutRequestsAlerts, newWorkoutsAlerts, workoutInvitesAlerts } =
    useAlerts();

  const [currentWorkout, setCurrentWorkout] = useState();

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
  const checkIfCurrentWorkout = async (now) => {
    console.log("checking if theres current workout");
    for (var [key, value] of Object.entries(user.workouts)) {
      if (
        new Date(value[0].toDate().getTime() + value[1] * 60000) > now &&
        value[0].toDate() < now
      ) {
        return await firebase.getWorkout(key);
      }
    }
  };
  useFocusEffect(
    useCallback(() => {
      setScreen("Home");
      const initialCheckCurrentWorkout = async () => {
        const now = new Date();
        const currentWorkoutReturned = await checkIfCurrentWorkout(now);
        if (!currentWorkoutReturned) {
          const lastQuarter = now.getMinutes() % 15;
          console.log(lastQuarter);
          //16 so there wont be bug checking 16:15:89 workout at 16:15:75. prefer to check at 16:16:XX to make sure
          var nextCheck = new Date(now.getTime() + (16 - lastQuarter) * 60000);
          console.log(now);
          console.log(nextCheck);
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
        <View className="flex-row justify-between my-5">
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
        <TouchableOpacity
          style={{
            backgroundColor: appStyle.color_success,
            borderWidth: 2,
            borderColor: appStyle.color_primary,
          }}
          className="rounded"
        >
          <Text>Confirm workout</Text>
        </TouchableOpacity>
      </View>

      <BottomNavbar currentScreen="Home" />
    </View>
  );
};

export default HomeScreen;
