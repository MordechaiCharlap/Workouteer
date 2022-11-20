import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import * as appStyle from "./AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
const WorkoutLocation = () => {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <FontAwesomeIcon
          icon={faLocationDot}
          size={25}
          color={appStyle.appGray}
        />
        <Text className="ml-1" style={{ color: appStyle.appGray }}>
          Location:
        </Text>
      </View>

      <TouchableOpacity
        className="rounded justify-center p-1 px-3"
        style={{ backgroundColor: appStyle.appLightBlue }}
      >
        <Text style={{ color: appStyle.appDarkBlue }}>Current location</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="rounded justify-center p-1 px-3"
        style={{ backgroundColor: appStyle.appLightBlue }}
      >
        <Text style={{ color: appStyle.appDarkBlue }}>Set location</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutLocation;
