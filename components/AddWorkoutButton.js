import { View, Text, TouchableOpacity, Animated } from "react-native";
import { React, useEffect, useRef, useState } from "react";
import NewWorkout from "./NewWorkout";

const AddWorkoutButton = () => {
  const addWorkoutOpacity = useRef(new Animated.Value(0)).current;
  const addButtonMarginTop = useRef(new Animated.Value(400)).current;
  const addButtonOpacity = useRef(new Animated.Value(0)).current;
  const animationMiliSec = 1000;
  const [isAdd, setAdd] = useState(false);
  const [newWorkoutDisplay, setNewWorkoutDisplay] = useState("none");
  useEffect(() => {
    console.log("layouteffect");
    Animated.spring(addButtonMarginTop, {
      toValue: 300,
      duration: 2000,
      useNativeDriver: false,
    }).start();
    Animated.timing(addButtonOpacity, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, []);
  const workoutButtonClicked = () => {
    if (!isAdd) addWorkoutIn();
    else addWorkoutOut();
  };

  const addWorkoutIn = () => {
    setNewWorkoutDisplay("block");
    console.log("Queue animation in");
    Animated.timing(addWorkoutOpacity, {
      toValue: 1,
      duration: animationMiliSec,
      useNativeDriver: false,
    }).start();
    Animated.timing(addButtonMarginTop, {
      toValue: 20,
      duration: animationMiliSec,
      useNativeDriver: false,
    }).start();
    const timer = setTimeout(() => {
      setAdd(true);
    }, animationMiliSec);
    return () => clearTimeout(timer);
  };

  const addWorkoutOut = () => {
    console.log("Queue animation out");
    Animated.timing(addWorkoutOpacity, {
      toValue: 0,
      duration: animationMiliSec,
      useNativeDriver: false,
    }).start();
    Animated.timing(addButtonMarginTop, {
      toValue: 300,
      duration: animationMiliSec,
      useNativeDriver: false,
    }).start();
    const timer = setTimeout(() => {
      setNewWorkoutDisplay("none");
      setAdd(false);
    }, animationMiliSec);
    return () => clearTimeout(timer);
  };

  return (
    <View className="self-center flex-1 items-center w-full">
      <Animated.View
        style={{
          marginTop: addButtonMarginTop,
          opacity: addButtonOpacity,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          className="items-center justify-center bg-slate-50 p-2 pt-3 pb-3 rounded-lg shadow-lg mb-3"
          onPress={workoutButtonClicked}
        >
          <Text className="font-bold text-center text-4xl">Add a workout</Text>
        </TouchableOpacity>
        <NewWorkout display={newWorkoutDisplay} opacity={addWorkoutOpacity} />
      </Animated.View>
    </View>
  );
};

export default AddWorkoutButton;
