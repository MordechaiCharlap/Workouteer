import { View, Text, TouchableOpacity } from "react-native";
import { workoutTypes } from "./WorkoutType";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as appStyle from "../components/AppStyleSheet";

const ConfirmCurrentWorkoutButton = (props) => {
  return (
    <View>
      <TouchableOpacity
        className="rounded-full p-2 flex-row"
        style={{
          backgroundColor: appStyle.color_bg_variant,
        }}
      >
        <FontAwesomeIcon
          icon={workoutTypes[props.currentWorkout.type].icon}
          size={30}
          color={"black"}
        />
        <Text>Confirm workout to get points</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmCurrentWorkoutButton;
