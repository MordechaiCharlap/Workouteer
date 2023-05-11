import { View, FlatList, StatusBar } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import * as firebase from "../services/firebase";
import WorkoutComponent from "../components/WorkoutComponent";
import LoadingAnimation from "../components/LoadingAnimation";
import * as appStyle from "../utilities/appStyleSheet";
import languageService from "../services/languageService";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import useConfirmedWorkouts from "../hooks/useConfirmedWorkouts";
import useAuth from "../hooks/useAuth";
const PastWorkoutsScreen = ({ route }) => {
  const { user } = useAuth();
  const shownUser = route.params.shownUser ? route.params.shownUser : user;
  const { setCurrentScreen } = useNavbarDisplay();
  const { getConfirmedWorkoutsByUserId, confirmedWorkouts } =
    useConfirmedWorkouts();
  const [confirmedWorkoutsArray, setConfirmedWorkoutsArray] = useState(
    shownUser.id == shownUser.id ? confirmedWorkouts : []
  );
  const [workouts, setWorkouts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("PastWorkout");
    }, [])
  );
  useEffect(() => {
    if (user.id == shownUser.id) return;
    console.log("Another user workouts");
    const getShownUserConfirmedWorkouts = async () => {
      const shownUserWorkouts = await getConfirmedWorkoutsByUserId(
        shownUser.id
      );
      console.log(shownUserWorkouts);
      setConfirmedWorkoutsArray(shownUserWorkouts);
    };
    getShownUserConfirmedWorkouts();
  }, []);
  useEffect(() => {
    const getWorkouts = async () => {
      const workoutsArr = await firebase.getPastWorkouts(
        confirmedWorkoutsArray
      );
      setWorkouts(workoutsArr);
      setInitialLoading(false);
    };
    getWorkouts();
  }, [confirmedWorkoutsArray]);
  return (
    <View style={safeAreaStyle()}>
      <Header
        title={languageService[user.language].pastWorkouts}
        goBackOption={true}
      />
      <View className="flex-1 px-4">
        {initialLoading ? (
          <LoadingAnimation />
        ) : (
          <FlatList
            className="p-2"
            showsVerticalScrollIndicator={false}
            data={workouts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <WorkoutComponent workout={item} isPastWorkout={true} />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default PastWorkoutsScreen;
