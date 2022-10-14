import { View, Text, TouchableOpacity, Animated } from "react-native";
import { React, useRef, useState, useEffect } from "react";
import { PlusCircleIcon } from "react-native-heroicons/solid";
import NewWorkout from "./NewWorkout";

const AddWorkoutButton = () => {
  const plusSize = useRef(new Animated.Value(200)).current;
  const plusSizeView = useRef(new Animated.Value(250)).current;
  const addWorkoutOpacity = useRef(new Animated.Value(0)).current;
  const marginTopRef = useRef(new Animated.Value(150)).current;
  const animationMiliSec = 1500;
  const [buttonSign, setButtonSign] = useState("+");
  const [newWorkoutDisplay, setNewWorkoutDisplay] = useState("none");

  const workoutButtonClicked = () => {
    if (buttonSign == "+") addWorkoutIn();
    else addWorkoutOut();
  };
  const addWorkoutOut = () => {
    console.log("Queue animation");
    setButtonSign("+");
    Animated.timing(plusSize, {
      toValue: 200,
      duration: animationMiliSec,
      useNativeDriver: false,
    }).start();
    Animated.timing(plusSizeView, {
      toValue: 250,
      duration: animationMiliSec,
      useNativeDriver: false,
    }).start();
    Animated.timing(addWorkoutOpacity, {
      toValue: 0,
      duration: animationMiliSec,
      useNativeDriver: false,
    }).start();
    Animated.timing(marginTopRef, {
      toValue: 150,
      duration: animationMiliSec,
      useNativeDriver: false,
    }).start();
    const timer = setTimeout(() => {
      setNewWorkoutDisplay("none");
    }, animationMiliSec);

    return () => clearTimeout(timer);
  };

  const addWorkoutIn = () => {
    setNewWorkoutDisplay("block");
    console.log("Queue animation");
    Animated.timing(plusSize, {
      toValue: 50,
      duration: animationMiliSec,
      useNativeDriver: false,
    }).start();
    Animated.timing(plusSizeView, {
      toValue: 75,
      duration: animationMiliSec,
      useNativeDriver: false,
    }).start();
    Animated.timing(addWorkoutOpacity, {
      toValue: 1,
      duration: animationMiliSec,
      useNativeDriver: false,
    }).start();
    Animated.timing(marginTopRef, {
      toValue: 20,
      duration: animationMiliSec,
      useNativeDriver: false,
    }).start();
    const timer = setTimeout(() => {
      setButtonSign("X");
    }, animationMiliSec);
    return () => clearTimeout(timer);
  };
  return (
    <View className="self-center flex-1 items-center w-full bg-gray-800">
      <Animated.View style={{ marginTop: marginTopRef }}>
        <Text className="font-bold text-center text-4xl">Add a workout</Text>
        <TouchableOpacity
          className="items-center justify-center"
          onPress={workoutButtonClicked}
        >
          <Animated.View
            className="border-2 m-2 justify-center"
            style={{
              borderColor: "#66fcf1",
              width: plusSizeView,
              height: plusSizeView,
            }}
          >
            <Animated.Text
              style={{
                fontSize: plusSize,
                color: "#66fcf1",
              }}
              className="text-center"
            >
              {buttonSign}
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>
        <NewWorkout display={newWorkoutDisplay} opacity={addWorkoutOpacity} />
      </Animated.View>
    </View>
  );
};

export default AddWorkoutButton;
