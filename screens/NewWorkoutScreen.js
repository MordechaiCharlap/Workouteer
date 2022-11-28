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
import WorkoutLocation from "../components/WorkoutLocation";
import Header from "../components/Header";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
const NewWorkoutScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const now = new Date();
  const [type, setType] = useState(null);
  const [startingTime, setStartingTime] = useState(null);
  const [minutes, setMinutes] = useState(null);
  //const [waitingTime, setWaitingTime] = useState(null);
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState("");
  const [isCreateDisabled, setIsCreateDisabled] = useState(true);
  const [createButtonTextColor, setCreateButtonTextColor] = useState("white");
  const [createButtonColor, setCreateButtonColor] = useState("black");
  useEffect(() => {
    checkIfCanAddWorkout();
  }, [type, startingTime, minutes, location]);
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
      location != null
    ) {
      setIsCreateDisabled(false);
      setCreateButtonTextColor(appStyle.appDarkBlue);
      setCreateButtonColor(appStyle.appLightBlue);
    } else {
      setIsCreateDisabled(true);
      setCreateButtonTextColor("white");
      setCreateButtonColor("black");
    }
  };
  const createWorkout = async () => {
    const workout = {
      creator: user.usernameLower,
      members: { [user.usernameLower]: true },
      type: type,
      startingTime: startingTime,
      minutes: minutes,
      location: location,
      description: description,
    };
    await firebase.createWorkout(workout);
    await firebase.updateContext(user.usernameLower);
    navigation.goBack();
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <Header title="New workout" goBackOption={true} />
      <View
        className="flex-1 px-4"
        style={{
          backgroundColor: appStyle.appDarkBlue,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="pt-4 pb-2 rounded">
            {/* margin is inside the component after each types row */}
            <WorkoutType typeSelected={setType} />
          </View>
          <View className="pb-2 rounded mb-5">
            <WorkoutStartingTime
              startingTimeChanged={setStartingTime}
              minDate={now}
            />
          </View>
          <View className="pb-2 rounded mb-5">
            <WorkoutMinutes minutesSelected={setMinutes} />
          </View>
          <View className="pb-2 rounded mb-5">
            <WorkoutDescription descChanged={setDescription} />
          </View>
          <View className="pb-2 rounded mb-5">
            <WorkoutLocation locationChanged={setLocation} />
          </View>
          <View className="items-center mb-5">
            <TouchableOpacity
              style={{
                backgroundColor: createButtonColor,
              }}
              disabled={isCreateDisabled}
              className="rounded-lg shadow px-7 py-1"
              onPress={createWorkout}
            >
              <Text
                style={{ color: createButtonTextColor }}
                className="text-center text-2xl font-semibold"
              >
                Create
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default NewWorkoutScreen;
