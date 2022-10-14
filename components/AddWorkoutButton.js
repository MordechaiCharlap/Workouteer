import { View, Text, TouchableOpacity, Animated } from "react-native";
import { React, useRef, useState, useEffect } from "react";
import { PlusCircleIcon } from "react-native-heroicons/solid";
import NewWorkout from "./NewWorkout";

const AddWorkoutButton = () => {
  const addWorkoutOpacity = useRef(new Animated.Value(0)).current;
  const plusSize = useRef(new Animated.Value(300)).current;
  const marginTopRef = useRef(new Animated.Value(200)).current;
  const plusViewOpa = new Animated.Value(1);
  const animationMiliSec = 1500;
  const addWorkoutIn = () => {
    console.log("Queue animation");
    Animated.timing(plusSize, {
      toValue: 50,
      duration: animationMiliSec,
    }).start();
    Animated.timing(addWorkoutOpacity, {
      toValue: 1,
      duration: animationMiliSec,
    }).start();
    Animated.timing(marginTopRef, {
      toValue: 20,
      duration: animationMiliSec,
    }).start();
  };
  return (
    <View className="self-center flex-1 items-center w-full bg-gray-800">
      <Animated.View style={{ marginTop: marginTopRef }}>
        <Text className="font-bold text-center text-4xl">Add a workout</Text>
        <TouchableOpacity className="items-center" onPress={addWorkoutIn}>
          <Animated.View
            style={{
              opacity: plusViewOpa,
              width: plusSize,
              height: plusSize,
            }}
          >
            <PlusCircleIcon size={plusSize} color="#03dac6" />
          </Animated.View>
        </TouchableOpacity>
        <NewWorkout opacity={addWorkoutOpacity} />
      </Animated.View>
    </View>
  );
};

export default AddWorkoutButton;
