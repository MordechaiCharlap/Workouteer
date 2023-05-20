import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as appStyle from "../utilities/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faDumbbell } from "@fortawesome/free-solid-svg-icons";
import { faPersonWalking } from "@fortawesome/free-solid-svg-icons";
import { faPersonRunning } from "@fortawesome/free-solid-svg-icons";
import { faPersonBiking } from "@fortawesome/free-solid-svg-icons";
import languageService from "../services/languageService";
import CustomButton from "./basic/CustomButton";
import CustomText from "./basic/CustomText";
export const workoutTypes = [
  {
    id: 0,
  },
  {
    id: 1,
    icon: faDumbbell,
  },
  {
    id: 2,
    icon: faPersonWalking,
  },
  {
    id: 3,
    icon: faPersonRunning,
  },
  {
    id: 4,
    icon: faPersonBiking,
  },
];
const iconSize = 60;
const genericStyle = {
  marginBottom: 12,
  paddingVertical: 15,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 8,
};
const chosenBackgroundStyle = {
  backgroundColor: appStyle.color_on_background,
};
const notChosenBackgroundStyle = {
  backgroundColor: appStyle.color_surface_variant,
};
const WorkoutType = (props) => {
  const style = StyleSheet.create({
    typeButton: {
      width: "48%",
      ...notChosenBackgroundStyle,
      ...genericStyle,
    },
    chosenTypeButton: {
      width: "48%",
      ...chosenBackgroundStyle,
      borderColor: appStyle.color_outline,
      ...genericStyle,
    },
    everythingButton: {
      ...notChosenBackgroundStyle,
      ...genericStyle,
    },
    chosenEverythingButton: {
      ...chosenBackgroundStyle,
      borderColor: appStyle.color_outline,
      ...genericStyle,
    },
  });
  const [chosenType, setChosenType] = useState(
    props.value != null ? props.value : 0
  );
  const typeClicked = (id) => {
    setChosenType(id);
  };
  useEffect(() => {
    props.typeSelected(chosenType);
  }, [chosenType]);
  const renderWorkoutTypeButton = (type) => {
    return (
      <CustomButton
        onPress={() => {
          typeClicked(type.id);
        }}
        style={
          type.id == chosenType ? style.chosenTypeButton : style.typeButton
        }
      >
        <FontAwesomeIcon
          color={
            type.id == chosenType
              ? appStyle.color_background
              : appStyle.color_on_surface_variant
          }
          icon={type.icon}
          size={iconSize}
        />
        <CustomText
          style={{
            color:
              type.id == chosenType
                ? appStyle.color_background
                : appStyle.color_on_surface_variant,
          }}
        >
          {languageService[props.language].workoutTypes[type.id]}
        </CustomText>
      </CustomButton>
    );
  };
  return (
    <View>
      {props.everythingOption == true && (
        <CustomButton
          onPress={() => {
            typeClicked(workoutTypes[0].id);
          }}
          style={
            workoutTypes[0].id == chosenType
              ? style.chosenEverythingButton
              : style.everythingButton
          }
        >
          <CustomText
            className="text-center font-bold tracking-widest"
            style={{
              color:
                workoutTypes[0].id == chosenType
                  ? appStyle.color_background
                  : appStyle.color_on_surface_variant,
            }}
          >
            {languageService[props.language].workoutTypes[0]}
          </CustomText>
        </CustomButton>
      )}
      <View className="flex-row flex-wrap justify-between">
        {renderWorkoutTypeButton(workoutTypes[1])}
        {renderWorkoutTypeButton(workoutTypes[2])}
        {renderWorkoutTypeButton(workoutTypes[3])}
        {renderWorkoutTypeButton(workoutTypes[4])}
      </View>
    </View>
  );
};

export default WorkoutType;
