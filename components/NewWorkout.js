import { View, Text, Animated, ScrollView, Button } from "react-native";
import React, { useState } from "react";
import WorkoutType from "./WorkoutType";
import WorkoutMinutes from "./WorkoutMinutes";
import WorkoutStartingTime from "./WorkoutStartingTime";
import WorkoutMaximumWaiting from "./WorkoutMaximumWaiting";

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
    <Animated.ScrollView
      style={{ opacity: props.opacity, display: props.display }}
      className="bg-slate-400"
    >
      <View className="border-2 p-2 rounded mb-5">
        <WorkoutType typeSelected={typeSelected} />
      </View>
      <View className="border-2 p-2 rounded mb-5">
        <WorkoutMinutes minutesSelected={minutesSelected} />
      </View>
      <View className="border-2 p-2 rounded mb-5">
        <WorkoutStartingTime startingTimeSelected={startingTimeSelected} />
      </View>
      <View className="border-2 p-2 rounded mb-5">
        <WorkoutMaximumWaiting waitingTimeSelected={waitingTimeSelected} />
      </View>

      <Button title="Next" disabled={isNextDisabled} />
    </Animated.ScrollView>
  );
};

export default NewWorkout;
