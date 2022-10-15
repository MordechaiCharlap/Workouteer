import { View, Text, FlatList, TouchableOpacity, Button } from "react-native";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

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
  const [chosenType, setChosenType] = useState(0);
  const getBackgroundColor = (id) => {
    if (chosenType == id) return "bg-indigo-400";
    return "bg-gray-500";
  };
  const typeClicked = (id) => {
    props.typeSelected(id);
    setChosenType(id);
  };
  return (
    <View className="items-center w-full bg-green-500 ">
      <Text>WorkoutType</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        className="w-80 p-4"
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
              className={`w-28 h-28 border-2 p-4 border-white items-center m-1 ${getBackgroundColor(
                item.id
              )}`}
            >
              <FontAwesomeIcon icon={item.icon} size={90} />
              <Text>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default WorkoutType;
