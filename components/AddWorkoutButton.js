import { View, Text, TouchableOpacity, Animated } from "react-native";
import { React, useRef } from "react";
import { PlusCircleIcon } from "react-native-heroicons/solid";
import NewWorkout from "./NewWorkout";

const AddWorkoutButton = () => {
  const addWorkoutOpacity = useRef(new Animated.Value(0)).current;
  const plusSize = useRef(new Animated.Value(200)).current;
  const marginTopRef = useRef(new Animated.Value(200)).current;

  const addWorkoutIn = () => {
    console.log("Queue animation");
    Animated.timing(plusSize, {
      toValue: 50,
      duration: 2000,
    }).start();
    Animated.timing(addWorkoutOpacity, {
      toValue: 1,
      duration: 2000,
    }).start();
    Animated.timing(marginTopRef, {
      toValue: 20,
      duration: 2000,
    }).start();
  };
  return (
    <View className="self-center flex-1 items-center w-full bg-gray-800">
      <Animated.View style={{ marginTop: marginTopRef }}>
        <Text className="font-bold text-center text-4xl">Add a workout</Text>
        <TouchableOpacity className="items-center" onPress={addWorkoutIn}>
          <PlusCircleIcon size={plusSize._value} color="#03dac6" />
        </TouchableOpacity>
        <NewWorkout opacity={addWorkoutOpacity} />
      </Animated.View>
    </View>
  );
};

export default AddWorkoutButton;
