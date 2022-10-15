import { View, Text, Animated, ScrollView, Button } from "react-native";
import React, { useState } from "react";
import WorkoutType from "./WorkoutType";
import WorkoutMinutes from "./WorkoutMinutes";
import WorkoutStartingTime from "./WorkoutStartingTime";
import WorkoutMaximumWaiting from "./WorkoutMaximumWaiting";
import * as appStyle from "./AppStyleSheet";
const NewWorkout = (props) => {
  const [type, setType] = useState(null);
  const [startingTime, setStartingTime] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [waitingTime, setWaitingTime] = useState(null);
  const [location, setLocation] = useState(null);
  const [isNextDisabled, setIsNextDisabled] = useState(true);

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
  const checkIfCanAddWorkout = () => {
    console.log("check if can add");
    if (
      type != null &&
      startingTime != null &&
      minutes != null &&
      location != null &&
      waitingTime != null
    )
      setIsNextDisabled(false);
    else {
      setIsNextDisabled(true);
    }
  };
  return (
    <Animated.View
      className="rounded-xl"
      style={{
        opacity: props.opacity,
        display: props.display,
        backgroundColor: appStyle.appYellow,
      }}
    >
      <View className="p-2 rounded mb-5">
        <WorkoutType typeSelected={typeSelected} />
      </View>
      <View className="p-2 rounded mb-5">
        <WorkoutMinutes minutesSelected={minutesSelected} />
      </View>
      <View className="p-2 rounded mb-5">
        <WorkoutStartingTime startingTimeSelected={startingTimeSelected} />
      </View>
      <View className="p-2 rounded mb-5">
        <WorkoutMaximumWaiting waitingTimeSelected={waitingTimeSelected} />
      </View>

      <Button title="Next" disabled={isNextDisabled} />
    </Animated.View>
  );
};

export default NewWorkout;
