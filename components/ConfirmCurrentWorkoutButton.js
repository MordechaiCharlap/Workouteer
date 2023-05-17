import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { workoutTypes } from "./WorkoutType";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as appStyle from "../utilities/appStyleSheet";
import { useNavigation } from "@react-navigation/native";
import languageService from "../services/languageService";
import useResponsiveness from "../hooks/useResponsiveness";
const ConfirmCurrentWorkoutButton = (props) => {
  const { windowHeight } = useResponsiveness();
  const user = props.user;
  const navigation = useNavigation();
  const iconSize = windowHeight
    ? windowHeight / 15
    : Dimensions.get("window").height / 15;
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ConfirmWorkout")}
      className="flex-row items-center w-full rounded"
      style={{
        backgroundColor: appStyle.color_primary,
      }}
    >
      <View
        style={{ backgroundColor: appStyle.color_primary, padding: 7 }}
        className="rounded-l"
      >
        <FontAwesomeIcon
          icon={workoutTypes[props.currentWorkout.type].icon}
          size={iconSize}
          color={appStyle.color_on_primary}
        />
      </View>
      <Text
        className="text-center flex-1 tracking-widest font-semibold text-lg"
        style={{ color: appStyle.color_on_primary }}
      >
        {languageService[user.language].confirmWorkout[user.isMale ? 1 : 0]}
      </Text>
    </TouchableOpacity>
  );
};

export default ConfirmCurrentWorkoutButton;
