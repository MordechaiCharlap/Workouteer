import { View, Text } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFire, faDumbbell, faBolt } from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../AppStyleSheet";
const UserStats = (props) => {
  const iconSize = 30;
  const iconColor = appStyle.color_primary;
  return (
    <View
      className="flex-row items-center rounded-2xl"
      style={{ borderWidth: 1, borderColor: appStyle.color_bg_variant }}
    >
      <View>
        <FontAwesomeIcon icon={faFire} size={iconSize} color={iconColor} />
      </View>
      <View>
        <FontAwesomeIcon icon={faDumbbell} size={iconSize} color={iconColor} />
      </View>
      <View>
        <FontAwesomeIcon icon={faBolt} size={iconSize} color={iconColor} />
      </View>
    </View>
  );
};

export default UserStats;
