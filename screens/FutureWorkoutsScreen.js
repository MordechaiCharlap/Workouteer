import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import * as appStyle from "../components/AppStyleSheet";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
import { workoutTypes } from "../components/WorkoutType";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStopwatch, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import WorkoutComponent from "../components/WorkoutComponent";
const FutureWorkoutsScreen = () => {
  const { user } = useAuth();
  const now = new Date();
  const [workouts, setWorkouts] = useState([]);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  useEffect(() => {
    const getWorkouts = async () => {
      console.log("getting workouts");
      const workoutsArr = await firebase.getFutureWorkouts(user, now);
      console.log(workoutsArr);
      setWorkouts(workoutsArr);
    };
    getWorkouts();
  }, []);

  const leaveWorkout = async (workout) => {
    removeFromUI(workout);
    await firebase.leaveWorkout(user, workout);
    await firebase.updateContext(user.usernameLower);
  };
  const cancelWorkout = async (workout) => {
    removeFromUI(workout);
    await firebase.cancelWorkout(user, workout);
    await firebase.updateContext(user.usernameLower);
  };
  const removeFromUI = (workout) => {
    const index = workouts.indexOf(workout);
    const workoutsClone = workouts;
    workoutsClone.splice(index, 1);
    setWorkouts(workoutsClone);
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <Header title="Future workouts" goBackOption={true} />
      <View className="flex-1 px-4">
        <FlatList
          className="p-2"
          showsVerticalScrollIndicator={false}
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WorkoutComponent
              now={now}
              workout={item}
              user={user}
              isPastWorkout={true}
              cancelWorkout={cancelWorkout}
              leaveWorkout={leaveWorkout}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default FutureWorkoutsScreen;
