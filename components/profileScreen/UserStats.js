import { View, StyleSheet } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faFire,
  faRankingStar,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../../utils/appStyleSheet";
import useAuth from "../../hooks/useAuth";
import WorkoutsStats from "./UserStats/WorkoutsStats";
import languageService from "../../services/languageService";
import CustomText from "../basic/CustomText";
import appComponentsDefaultStyles from "../../utils/appComponentsDefaultStyles";
const UserStats = ({ shownUser, color, backgroundColor }) => {
  const { user } = useAuth();
  const iconSize = 30;
  const renderStat = (icon, data) => {
    return (
      <View style={styleSheet.stat}>
        <FontAwesomeIcon icon={icon} size={iconSize} color={color} />
        <CustomText style={{ color: color, fontSize: 20, fontWeight: 600 }}>
          {data}
        </CustomText>
      </View>
    );
  };
  return (
    <View>
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            borderRadius: 20,
            backgroundColor: backgroundColor,
            borderWidth: 0.5,
            borderColor: appStyle.color_outline,
          },
          appComponentsDefaultStyles.shadow,
        ]}
      >
        {renderStat(faBolt, shownUser.totalPoints)}
        {renderStat(
          faRankingStar,
          languageService[user.language].leagues[shownUser.league]
        )}
        {renderStat(faFire, shownUser.streak)}
      </View>
      <View style={{ height: 10 }}></View>
      <View style={{ height: 200 }}>
        <WorkoutsStats
          shownUser={shownUser}
          color={color}
          backgroundColor={backgroundColor}
        />
      </View>

      <View className="flex-row items-center py-2 w-1/3 justify-center gap-x-1"></View>
    </View>
  );
};

export const styleSheet = StyleSheet.create({
  stat: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    justifyContent: "center",
    columnGap: 4,
    width: "33.33%",
  },
});
export default UserStats;
