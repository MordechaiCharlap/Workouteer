import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import WorkoutType from "../components/WorkoutType";
import WorkoutMinutes from "../components/WorkoutMinutes";
import WorkoutStartingTime from "../components/WorkoutStartingTime";
import WorkoutMaximumWaiting from "../components/WorkoutMaximumWaiting";
import WorkoutDescription from "../components/WorkoutDescription";
import React, { useState, useEffect, useLayoutEffect } from "react";
import * as appStyle from "../components/AppStyleSheet";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { useNavigation } from "@react-navigation/native";
const NewWorkoutScreen = () => {
  const navigation = useNavigation();
  const [type, setType] = useState(null);
  const [startingTime, setStartingTime] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [waitingTime, setWaitingTime] = useState(null);
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState("");
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [nextButtonTextColor, setNextButtonTextColor] = useState("white");
  const [nextButtonColor, setNextButtonColor] = useState("black");
  useEffect(() => {
    checkIfCanAddWorkout();
  }, [type, startingTime, minutes, waitingTime]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const checkIfCanAddWorkout = () => {
    if (
      type != null &&
      startingTime != null &&
      minutes != null &&
      waitingTime != null
    ) {
      console.log("can add workout");
      setIsNextDisabled(false);
      setNextButtonTextColor(appStyle.appDarkBlue);
      setNextButtonColor("white");
    } else {
      console.log("cant add workout");
      setIsNextDisabled(true);
      setNextButtonTextColor("white");
      setNextButtonColor("black");
    }
  };
  const createWorkout = () => {};
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: appStyle.appGray,
          }}
        >
          <View className="pt-4 pb-2 rounded mb-5">
            <WorkoutType typeSelected={setType} />
          </View>
          <View className="pb-2 rounded mb-5">
            <WorkoutMinutes minutesSelected={setMinutes} />
          </View>
          <View className="pb-2 rounded mb-5">
            <WorkoutStartingTime startingTimeSelected={setStartingTime} />
          </View>
          <View className="pb-2 rounded mb-5">
            <WorkoutMaximumWaiting waitingTimeSelected={setWaitingTime} />
          </View>
          <View className="pb-2 rounded mb-5">
            <WorkoutDescription descChanged={setDescription} />
          </View>
          <View className="flex-row items-center justify-center">
            <TouchableOpacity
              style={{ borderWidth: 1, borderColor: "black" }}
              className="rounded-lg shadow px-5 py-1 mx-2"
              onPress={() => navigation.goBack()}
            >
              <Text
                style={{ color: "black" }}
                className="text-center text-2xl font-semibold"
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: nextButtonColor,
              }}
              disabled={isNextDisabled}
              className="rounded-lg shadow px-5 py-1 mx-2"
              onPress={createWorkout}
            >
              <Text
                style={{ color: nextButtonTextColor }}
                className="text-center text-2xl font-semibold"
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default NewWorkoutScreen;
