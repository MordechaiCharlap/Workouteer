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
      const workoutsArr = await firebase.getPastWorkouts(user);
      console.log(workoutsArr);
      setWorkouts(workoutsArr);
    };
    getWorkouts();
  }, []);
  const timeString = (date) => {
    var day;
    var time;
    if (now.getDate() == date.getDate()) day = "Today";
    else if (now.getDate() + 1 == date.getDate()) day = "Tomorrow";
    else {
      const dd = date.getDate();
      const mm = date.getMonth() + 1;
      day = dd + "/" + mm;
    }
    const hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const mm =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    time = hh + ":" + mm;
    return day + ", " + time;
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <Header title="Past workouts" goBackOption={true} />
      <View className="flex-1 px-4">
        <FlatList
          className="p-2"
          showsVerticalScrollIndicator={false}
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WorkoutComponent now={now} workout={item} user={user} />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default FutureWorkoutsScreen;
