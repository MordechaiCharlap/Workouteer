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
      const workoutsArr = await firebase.getFutureWorkouts(user);
      console.log(workoutsArr);
      setWorkouts(workoutsArr);
    };
    getWorkouts();
  }, []);
  const dateString = (date) => {
    if (now.getDate() == date.getDate()) return "Today";
    else if (now.getDate() + 1 == date.getDate()) return "Tomorrow";
    else {
      const dd = date.getDate();
      const mm = date.getMonth() + 1;
      return dd + "/" + mm;
    }
  };
  const timeString = (date) => {
    const hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const mm =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return hh + ":" + mm;
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1 px-4">
        <Header title="Future workouts" goBackOption={true} />
        <FlatList
          className="p-2"
          showsVerticalScrollIndicator={false}
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              className="rounded h-32"
              style={{ backgroundColor: appStyle.appAzure }}
            >
              <View className="flex-row">
                <Text>{dateString(item.startingTime.toDate())}</Text>
                <Text>{timeString(item.startingTime.toDate())}</Text>
              </View>

              <Text>{item.creator}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default FutureWorkoutsScreen;
