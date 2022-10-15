import { View, Text, Animated, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import WorkoutType from "./WorkoutType";
import WorkoutMinutes from "./WorkoutMinutes";
import WorkoutStartingTime from "./WorkoutStartingTime";
import WorkoutMaximumWaiting from "./WorkoutMaximumWaiting";
import WorkoutDescription from "./WorkoutDescription";
import * as appStyle from "./AppStyleSheet";
const NewWorkout = (props) => {
  const [type, setType] = useState(null);
  const [startingTime, setStartingTime] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [waitingTime, setWaitingTime] = useState(null);
  const [location, setLocation] = useState(null);
  const [desc, setDesc] = useState("");
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [nextButtonTextColor, setNextButtonTextColor] = useState("#f7cb99");
  const typeSelected = (id) => {
    setType(id);
    checkIfCanAddWorkout();
  };

  const startingTimeSelected = (time) => {
    setStartingTime(time);
    checkIfCanAddWorkout();
  };

  const minutesSelected = (minutes) => {
    setMinutes(minutes);
    checkIfCanAddWorkout();
  };
  const waitingTimeSelected = (minutes) => {
    setWaitingTime(minutes);
    checkIfCanAddWorkout();
  };

  const locationSelected = (id) => {
    setLocation(id);
    checkIfCanAddWorkout();
  };
  const workoutAdded = () => {};
  const checkIfCanAddWorkout = () => {
    console.log("check if can add");
    if (
      type != null &&
      startingTime != null &&
      minutes != null &&
      location != null &&
      waitingTime != null
    ) {
      setIsNextDisabled(false);
      setNextButtonTextColor(appStyle.appDarkBlue);
    } else {
      setIsNextDisabled(true);
      setNextButtonTextColor("#f7cb99");
    }
  };
  return (
    <Animated.View
      className="rounded-xl items-center content-center"
      style={{
        opacity: props.opacity,
        display: props.display,
        backgroundColor: appStyle.appYellow,
        width: "90%",
        height: "100%",
      }}
    >
      <View className="pt-4 pb-2 rounded mb-5">
        <WorkoutType typeSelected={typeSelected} />
      </View>
      <View className="pb-2 rounded mb-5">
        <WorkoutMinutes minutesSelected={minutesSelected} />
      </View>
      <View className="pb-2 rounded mb-5">
        <WorkoutStartingTime startingTimeSelected={startingTimeSelected} />
      </View>
      <View className="pb-2 rounded mb-5">
        <WorkoutMaximumWaiting waitingTimeSelected={waitingTimeSelected} />
      </View>
      <View className="pb-2 rounded mb-5">
        <WorkoutDescription descChanged={setDesc} />
      </View>
      <TouchableOpacity
        style={{
          width: "fit-content",
          marginHorizontal: "auto",
          marginBottom: 15,
          paddingHorizontal: 6,
          paddingVertical: 2,
          backgroundColor: appStyle.appOrange,
        }}
        disabled={isNextDisabled}
        className="rounded-lg shadow"
        onPress={workoutAdded}
      >
        <Text
          style={{
            color: nextButtonTextColor,
          }}
          className="text-center text-2xl font-semibold w-fit"
        >
          Next
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default NewWorkout;
