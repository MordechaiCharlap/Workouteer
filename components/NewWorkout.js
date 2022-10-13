import { View, Text, Animated } from "react-native";
import React from "react";

const NewWorkout = (props) => {
  return (
    <Animated.View style={{ opacity: props.opacity }}>
      <Text>NewWorkout</Text>
    </Animated.View>
  );
};

export default NewWorkout;
