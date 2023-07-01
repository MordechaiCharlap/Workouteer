import { View, FlatList, StatusBar } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import * as firebase from "../services/firebase";
import WorkoutComponent from "../components/WorkoutComponent";
import LoadingAnimation from "../components/LoadingAnimation";
import languageService from "../services/languageService";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import useConfirmedWorkouts from "../hooks/useConfirmedWorkouts";
import useAuth from "../hooks/useAuth";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
const PastWorkoutsScreen = ({ route }) => {
  const { user } = useAuth();
  const shownUser = route.params?.shownUser || user;
  const { setCurrentScreen } = useNavbarDisplay();
  const { getConfirmedWorkoutsByUserId, confirmedWorkouts } =
    useConfirmedWorkouts();
  const [confirmedWorkoutsArray, setConfirmedWorkoutsArray] = useState(
    shownUser.id == user.id ? confirmedWorkouts : []
  );
  const [workouts, setWorkouts] = useState();

  const listOpacity = useSharedValue(0);
  const listMarginTop = useSharedValue(50);
  const animatedListStyle = useAnimatedStyle(() => {
    return {
      opacity: listOpacity.value,
      marginTop: listMarginTop.value,
    };
  }, []);
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("PastWorkouts");
    }, [])
  );
  useEffect(() => {
    if (workouts) {
      listMarginTop.value = withTiming(0, { duration: 500 });
      listOpacity.value = withTiming(1, { duration: 500 });
    }
  }, [workouts]);
  useEffect(() => {
    if (user.id == shownUser.id) return;
    const getShownUserConfirmedWorkouts = async () => {
      const shownUserWorkouts = await getConfirmedWorkoutsByUserId(
        shownUser.id
      );
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
    };
    getWorkouts();
  }, [confirmedWorkoutsArray]);
  return (
    <View style={safeAreaStyle()}>
      <Header
        title={languageService[user.language].pastWorkouts}
        goBackOption={true}
      />
      <View className="flex-1 px-2">
        {workouts && (
          <Animated.FlatList
            style={animatedListStyle}
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
