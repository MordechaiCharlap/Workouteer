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

const WorkoutType = (props) => {
  const iconSize = 60;
  const style = StyleSheet.create({
    typeButton: {
      width: "48%",
      height: iconSize * 2,
      borderWidth: 1,
      borderColor: appStyle.color_primary,
      backgroundColor: appStyle.color_bg_variant,
    },
    chosenTypeButton: {
      width: "48%",
      borderWidth: 1,
      height: iconSize * 2,
      borderColor: appStyle.color_primary,
      backgroundColor: appStyle.color_primary,
    },
    everythingButton: {
      borderWidth: 1,
      borderColor: appStyle.color_primary,
      backgroundColor: appStyle.color_bg_variant,
    },
    chosenEverythingButton: {
      borderWidth: 1,
      borderColor: appStyle.color_primary,
      backgroundColor: appStyle.color_primary,
    },
  });
  const [chosenType, setChosenType] = useState(0);
  const typeClicked = (id) => {
    props.typeSelected(id);
    setChosenType(id);
  };
  const renderWorkoutTypeButton = (type) => {
    return (
      <TouchableOpacity
        onPress={() => {
          typeClicked(type.id);
        }}
        className="items-center justify-center rounded-lg mb-3"
        style={
          type.id == chosenType ? style.chosenTypeButton : style.typeButton
        }
      >
        <FontAwesomeIcon
          color={
            type.id == chosenType
              ? appStyle.color_on_primary
              : appStyle.color_primary_variant
          }
          icon={type.icon}
          size={iconSize}
        />
        <Text
          className="text-center"
          style={{
            color:
              type.id == chosenType
                ? appStyle.color_on_primary
                : appStyle.color_primary_variant,
          }}
        >
          {languageService[props.language].workoutTypes[type.id]}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      {props.everythingOption == true && (
        <TouchableOpacity
          onPress={() => {
            typeClicked(workoutTypes[0].id);
          }}
          className="rounded-lg mb-3"
        >
          <View
            style={
              workoutTypes[0].id == chosenType
                ? style.chosenEverythingButton
                : style.everythingButton
            }
            className={`p-4 items-center rounded-lg`}
          >
            <Text
              className="text-center font-bold tracking-widest"
              style={{
                color: appStyle.color_on_primary,
              }}
            >
              {languageService[props.language].workoutTypes[0]}
            </Text>
          </View>
        </TouchableOpacity>
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
