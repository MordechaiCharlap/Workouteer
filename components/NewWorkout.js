import { View, Text, Animated, ScrollView, FlatList } from "react-native";
import React from "react";
import WorkoutType from "./WorkoutType";
const NewWorkout = (props) => {
  return (
    <Animated.View style={{ opacity: props.opacity }} className="bg-slate-400">
      <ScrollView className="border-2 p-2 rounded">
        <WorkoutType />
      </ScrollView>
    </Animated.View>
  );
};

export default NewWorkout;
