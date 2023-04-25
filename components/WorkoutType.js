import { View, Text, FlatList, TouchableOpacity, Platform } from "react-native";
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
  const isWeb = Platform.OS == "web";
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
        className="rounded-lg mb-3"
        style={{
          width: "48%",
          borderWidth: 1,
          borderColor:
            type.id == chosenType
              ? appStyle.color_on_primary
              : appStyle.color_primary,
        }}
      >
        <View
          style={{
            backgroundColor:
              type.id == chosenType
                ? appStyle.color_primary
                : appStyle.color_bg,
          }}
          className={`py-4 px-2 items-center rounded-lg`}
        >
          <FontAwesomeIcon
            color={
              type.id == chosenType
                ? appStyle.color_on_primary
                : appStyle.color_primary
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
                  : appStyle.color_primary,
            }}
          >
            {languageService[props.language].workoutTypes[type.id]}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <View className="flex-row flex-wrap justify-between">
        {renderWorkoutTypeButton(workoutTypes[1])}
        {renderWorkoutTypeButton(workoutTypes[2])}
        {renderWorkoutTypeButton(workoutTypes[3])}
        {renderWorkoutTypeButton(workoutTypes[4])}
      </View>
      {props.everythingOption == true && (
        <TouchableOpacity
          onPress={() => {
            typeClicked(workoutTypes[0].id);
          }}
          className="rounded-lg mb-5"
          style={{
            borderWidth: 1,
            borderColor:
              workoutTypes[0].id == chosenType
                ? appStyle.color_on_primary
                : appStyle.color_primary,
          }}
        >
          <View
            style={{
              backgroundColor:
                workoutTypes[0].id == chosenType
                  ? appStyle.color_primary
                  : appStyle.color_bg,
            }}
            className={`p-4 items-center rounded-lg`}
          >
            <Text
              className="text-center font-bold tracking-widest"
              style={{
                color:
                  workoutTypes[0].id == chosenType
                    ? appStyle.color_on_primary
                    : appStyle.color_primary,
              }}
            >
              {languageService[props.language].workoutTypes[0]}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default WorkoutType;
