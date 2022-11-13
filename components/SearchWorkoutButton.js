import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import * as appStyle from "./AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
const SearchWorkoutButton = () => {
  return (
    <View>
      <TouchableOpacity
        className="items-center justify-center rounded-lg shadow-lg w-40 h-40"
        style={{ backgroundColor: appStyle.appAzure }}
      >
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          size={40}
          color={appStyle.appGray}
        />
        <Text className="font-bold text-center text-3xl text-white">
          SEARCH WORKOUT
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchWorkoutButton;
