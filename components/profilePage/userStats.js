import { View, Text } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faFire,
  faLightning,
  faDumbbell,
} from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../AppStyleSheet";
const UserStats = (props) => {
  const iconSize = 30;
  const iconColor = appStyle.color_primary;
  return (
    <View className="flex-row rounded-2xl">
      <FontAwesomeIcon icon={faFire} size={iconSize} color={iconColor} />
    </View>
  );
};

export default UserStats;
