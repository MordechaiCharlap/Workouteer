import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import * as appStyle from "./AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
const WorkoutLocation = () => {
  return (
    <View className="flex-row">
      <FontAwesomeIcon
        icon={faLocationDot}
        size={30}
        color={appStyle.appGray}
      />
      <Text style={{ color: appStyle.appGray }}>Location:</Text>
      <TouchableOpacity className="bg-black">
        <Text style={{ color: appStyle.appGray }}>Current location</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutLocation;
