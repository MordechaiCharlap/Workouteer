import { View, Text } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFire, faDumbbell, faBolt } from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../AppStyleSheet";
import useAuth from "../../hooks/useAuth";
import WorkoutsStats from "./UserStats/WorkoutsStats";
const UserStats = () => {
  const { user } = useAuth();
  const iconSize = 30;
  const iconColor = appStyle.color_primary;
  const renderStat = (icon, data) => {
    return (
      <View className="flex-row">
        <FontAwesomeIcon icon={icon} size={iconSize} color={iconColor} />
        <Text>{data}</Text>
      </View>
    );
  };
  return (
    <View>
      <View
        className="flex-row items-center rounded-2xl"
        style={{ borderWidth: 1, borderColor: appStyle.color_bg_variant }}
      >
        {renderStat(faBolt, user.totalPoints)}
        {renderStat(faFire, user.rank)}
      </View>
      <WorkoutsStats workouts={user.workouts} />
    </View>
  );
};

export default UserStats;
