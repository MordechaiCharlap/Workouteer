import { View, Text, FlatList, TouchableOpacity, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as appStyle from "./AppStyleSheet";
import { faDumbbell } from "@fortawesome/free-solid-svg-icons";
import { faPersonWalking } from "@fortawesome/free-solid-svg-icons";
import { faPersonRunning } from "@fortawesome/free-solid-svg-icons";
import { faPersonBiking } from "@fortawesome/free-solid-svg-icons";

const workoutTypes = [
  {
    id: 1,
    title: "Resistance Training",
    icon: faDumbbell,
  },
  {
    id: 2,
    title: "Walking",
    icon: faPersonWalking,
  },
  {
    id: 3,
    title: "Running",
    icon: faPersonRunning,
  },
  {
    id: 4,
    title: "Biking",
    icon: faPersonBiking,
  },
];

const WorkoutType = (props) => {
  const isWeb = Platform.OS == "web";
  const [chosenType, setChosenType] = useState(0);
  const getBackgroundColor = (id) => {
    if (chosenType == id) return appStyle.appDarkBlue;
    return appStyle.appLightBlue;
  };
  const getTextColor = (id) => {
    if (chosenType == id) return "white";
    return appStyle.appDarkBlue;
  };
  const typeClicked = (id) => {
    props.typeSelected(id);
    setChosenType(id);
  };
  return (
    <View className="items-center w-full">
      <FlatList
        showsHorizontalScrollIndicator={isWeb}
        initialScrollIndex={0.8}
        style={{ padding: 4, width: "95%" }}
        className="rounded-lg"
        data={workoutTypes}
        keyExtractor={(item) => item.id}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              typeClicked(item.id);
            }}
          >
            <View
              style={{ backgroundColor: getBackgroundColor(item.id) }}
              className={`w-28 h-28 p-4 items-center m-1 rounded-lg shadow-lg`}
            >
              <FontAwesomeIcon
                color={getTextColor(item.id)}
                icon={item.icon}
                size={90}
              />
              <Text
                style={{ textAlign: "center", color: getTextColor(item.id) }}
              >
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default WorkoutType;
