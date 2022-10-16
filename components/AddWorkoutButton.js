import { View, Text, TouchableOpacity, Animated } from "react-native";
import { React, useEffect, useRef, useState } from "react";
import NewWorkout from "./NewWorkout";
import * as appStyle from "./AppStyleSheet";
const AddWorkoutButton = (props) => {
  const useAnimate = false;
  // var newWorkoutOpacity;
  // var addButtonMarginTop;
  const [newWorkoutOpacity, setNewWorkoutOpacity] = useState(0);
  const [addButtonMarginTop, setAddButtonMarginTop] = useState(300);

  const animationMiliSec = 1500;
  const [isAdd, setAdd] = useState(false);
  const [newWorkoutDisplay, setNewWorkoutDisplay] = useState("hidden");

  useEffect(() => {
    if (useAnimate) {
      newWorkoutOpacity = new Animated.Value(1);
      addButtonMarginTop = new Animated.Value(20);

      Animated.spring(addButtonMarginTop, {
        toValue: 300,
        duration: 2000,
        useNativeDriver: true,
      }).start();
      Animated.timing(newWorkoutOpacity, {
        toValue: 1,
        duration: animationMiliSec,
        useNativeDriver: true,
      }).start();
    }
  }, []);

  const workoutButtonClicked = () => {
    //props.hideNavBar();
    if (!isAdd) addWorkoutIn();
    else addWorkoutOut();
  };

  const addWorkoutIn = () => {
    console.log("Queue animation in");
    if (useAnimate) {
      Animated.spring(addButtonMarginTop, {
        toValue: 20,
        duration: animationMiliSec,
        useNativeDriver: true,
      }).start();
      const timer = setTimeout(() => {
        setAdd(true);
        setNewWorkoutDisplay("block");
        Animated.spring(newWorkoutOpacity, {
          toValue: 1,
          duration: animationMiliSec,
          useNativeDriver: true,
        }).start();
      }, animationMiliSec / 3);
      return () => clearTimeout(timer);
    } else {
      setAdd(true);
      setNewWorkoutDisplay("block");
      setNewWorkoutOpacity(1);
      setAddButtonMarginTop(20);
    }
  };

  const addWorkoutOut = () => {
    console.log("Queue animation out");
    if (useAnimate) {
      Animated.spring(newWorkoutOpacity, {
        toValue: 0,
        duration: animationMiliSec / 3,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        setNewWorkoutDisplay("hidden");
        Animated.spring(addButtonMarginTop, {
          toValue: 300,
          duration: (animationMiliSec * 2) / 3,
          useNativeDriver: true,
        }).start();
        setAdd(false);
      }, animationMiliSec / 4);
      return () => clearTimeout(timer);
    } else {
      setAdd(false);
      setNewWorkoutDisplay("hidden");
      setNewWorkoutOpacity(0);
      setAddButtonMarginTop(300);
    }
  };

  return (
    <View className="self-center flex-1 items-center w-full">
      <Animated.View
        style={{
          width: "100%",
          marginTop: addButtonMarginTop,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          className="items-center justify-center  p-2 pt-3 pb-3 rounded-lg shadow-lg mb-3"
          style={{ backgroundColor: appStyle.appDarkBlue }}
          onPress={workoutButtonClicked}
        >
          <Text className="font-bold text-center text-4xl text-white">
            NEW WORKOUT
          </Text>
        </TouchableOpacity>
        <NewWorkout display={newWorkoutDisplay} opacity={newWorkoutOpacity} />
      </Animated.View>
    </View>
  );
};

export default AddWorkoutButton;
