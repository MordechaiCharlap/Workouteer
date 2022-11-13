import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import * as appStyle from "./AppStyleSheet";
const SearchWorkoutButton = () => {
  return (
    <View className="items-center">
      <TouchableOpacity
        className="items-center justify-center  p-2 pt-3 pb-3 rounded-lg shadow-lg mb-3"
        style={{ backgroundColor: appStyle.appAzure }}
      >
        <Text className="font-bold text-center text-4xl text-white">
          SEARCH WORKOUT
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchWorkoutButton;
