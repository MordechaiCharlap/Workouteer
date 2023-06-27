import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { workoutTypes } from "./WorkoutType";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as appStyle from "../utils/appStyleSheet";
import { useNavigation } from "@react-navigation/native";
import languageService from "../services/languageService";
import useResponsiveness from "../hooks/useResponsiveness";
import CustomButton from "./basic/CustomButton";
const ConfirmCurrentWorkoutButton = (props) => {
  const { windowHeight } = useResponsiveness();
  const navigation = useNavigation();
  buttonHeight = windowHeight / 10;
  const iconSize = windowHeight / 15;
  return (
    <CustomButton
      onPress={() => navigation.navigate("ConfirmWorkout")}
      style={{
        height: buttonHeight,
        aspectRatio: 2,
        borderTopRightRadius: 999,
        borderTopLeftRadius: 999,
        itemsAlign: "center",
        justifyContent: "flex-end",
        backgroundColor: appStyle.color_primary,
        paddingBottom: 2,
      }}
    >
      <FontAwesomeIcon
        icon={workoutTypes[props.currentWorkout.type].icon}
        size={iconSize}
        color={appStyle.color_on_primary}
      />
      {/* <View
        style={{
          position: "absolute",
          padding: 2,
          bottom: 2,
          left: 2,
          borderRadius: 999,
          backgroundColor: appStyle.color_tertiary,
        }}
      >
        <FontAwesomeIcon
          icon={faExclamationCircle}
          size={iconSize / 2}
          color={appStyle.color_background}
        />
      </View> */}
    </CustomButton>
  );
};

export default ConfirmCurrentWorkoutButton;
