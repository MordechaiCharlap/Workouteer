import { View, Text } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faFire,
  faRankingStar,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../../utilites/appStyleSheet";
import useAuth from "../../hooks/useAuth";
import WorkoutsStats from "./UserStats/WorkoutsStats";
import languageService from "../../services/languageService";
const UserStats = (props) => {
  const { user } = useAuth();
  const shownUser = props.shownUser;
  const iconSize = 30;
  const iconColor = appStyle.color_primary;
  const renderStat = (icon, data) => {
    return (
      <View className="flex-row items-center py-2 w-1/3 rounded justify-center gap-x-1">
        <FontAwesomeIcon icon={icon} size={iconSize} color={iconColor} />
        <Text className="text-lg font-semibold">{data}</Text>
      </View>
    );
  };
  const renderStreak = () => {};
  return (
    <View className="gap-y-2">
      <View
        className="flex-row items-center justify-evenly rounded-full"
        style={{ borderWidth: 1, borderColor: appStyle.color_primary }}
      >
        {renderStat(faBolt, shownUser.totalPoints)}
        {renderStat(
          faRankingStar,
          languageService[user.language].leagues[shownUser.league]
        )}
        {renderStat(faFire, shownUser.streak)}
        {renderStreak()}
      </View>
      <View style={{ height: 180 }}>
        <WorkoutsStats workouts={shownUser.workouts} />
      </View>
    </View>
  );
};

export default UserStats;
