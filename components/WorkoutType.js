import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
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

const WorkoutType = () => {
  return (
    <View className="items-center w-full bg-green-500">
      <Text>WorkoutType</Text>
      <FlatList
        className="w-80"
        data={workoutTypes}
        keyExtractor={(item) => item.id}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity>
            <View className="w-28 h-28 border-2 p-4 border-white items-center">
              <FontAwesomeIcon icon={item.icon} size="xl" />
              <Text>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default WorkoutType;
