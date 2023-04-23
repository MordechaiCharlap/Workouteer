import { View, Text, TouchableOpacity, Alert } from "react-native";
import { workoutTypes } from "./WorkoutType";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as appStyle from "../components/AppStyleSheet";
import { useNavigation } from "@react-navigation/native";
import languageService from "../services/languageService";
const ConfirmCurrentWorkoutButton = (props) => {
  const user = props.user;
  const navigation = useNavigation();
  return (
    <View className="w-3/4">
      <TouchableOpacity
        onPress={() => navigation.navigate("ConfirmWorkout")}
        className="rounded-full p-2 flex-row items-center w-full"
        style={{
          borderWidth: 2,
          borderColor: appStyle.color_on_primary,
          backgroundColor: appStyle.color_bg_variant,
        }}
      >
        <View
          className="rounded-full p-2"
          style={{
            borderWidth: 0.5,
            borderColor: appStyle.color_on_primary,
            backgroundColor: appStyle.color_primary,
          }}
        >
          <FontAwesomeIcon
            icon={workoutTypes[props.currentWorkout.type].icon}
            size={30}
            color={appStyle.color_on_primary}
          />
        </View>
        <Text
          className="text-center flex-1"
          style={{ color: appStyle.color_on_primary }}
        >
          {languageService[user.language].confirmWorkout[user.isMale ? 1 : 0]}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmCurrentWorkoutButton;
