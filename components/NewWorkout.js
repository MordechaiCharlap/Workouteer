import { View, Text, Animated, ScrollView, Button } from "react-native";
import React, { useState } from "react";
import WorkoutType from "./WorkoutType";
import WorkoutMinutes from "./WorkoutMinutes";

const NewWorkout = (props) => {
  const [type, setType] = useState(null);
  const [startingTime, setStartingTime] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [location, setLocation] = useState(null);
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  const typeSelected = (id) => {
    setType(id);
    checkIfCanAddWorkout();
  };

  const startingTimeSelected = (id) => {
    setStartingTime(id);
    checkIfCanAddWorkout();
  };

  const minutesSelected = (id) => {
    setMinutes(id);
    checkIfCanAddWorkout();
  };
  const locationSelected = (id) => {
    setLocation(id);
    checkIfCanAddWorkout();
  };
  const checkIfCanAddWorkout = () => {
    if (
      type != null &&
      startingTime != null &&
      minutes != null &&
      location != null
    )
      isNextDisabled = false;
  };
  return (
    <Animated.View style={{ opacity: props.opacity }} className="bg-slate-400">
      <View className="border-2 p-2 rounded mb-5">
        <WorkoutType typeSelected={typeSelected} />
      </View>
      <View className="border-2 p-2 rounded mb-5">
        <WorkoutMinutes minutesSelected={minutesSelected} />
      </View>

      <Button title="Next" disabled={isNextDisabled} />
    </Animated.View>
  );
};

export default NewWorkout;
