import { View, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import NavbarButton from "./NavbarButton";
import * as appStyle from "../utilities/appStyleSheet";
import useAlerts from "../hooks/useAlerts";
import useResponsiveness from "../hooks/useResponsiveness";
import { isWebOnPC } from "../services/webScreenService";
import useCurrentWorkout from "../hooks/useCurrentWorkout";
const BottomNavbar = () => {
  const { chatsAlerts, friendRequestsAlerts } = useAlerts();
  const { currentWorkout } = useCurrentWorkout();
  const { windowHeight } = useResponsiveness();
  const fixedWidth = isWebOnPC
    ? (9 / 19) * (windowHeight ? windowHeight : Dimensions.get("window").height)
    : Dimensions.get("window").width;
  return (
    <View
      className="items-center"
      style={{
        height: Math.max(
          (windowHeight ? windowHeight : Dimensions.get("window").height) / 13,
          30
        ),
      }}
    >
      <View
        className={`flex-row justify-around h-full`}
        style={{
          borderTopColor: appStyle.color_outline,
          borderTopWidth: 0.5,
          width: fixedWidth,
          backgroundColor: appStyle.color_surface,
        }}
      >
        <NavbarButton
          screen="MyProfile"
          alert={Object.keys(friendRequestsAlerts).length > 0}
        />
        <NavbarButton screen="Leaderboard" />
        <NavbarButton screen="Home" alert={currentWorkout != null} />
        <NavbarButton
          screen="Chats"
          alert={Object.keys(chatsAlerts).length > 0}
        />
        <NavbarButton screen="Explore" />
      </View>
    </View>
  );
};
export default BottomNavbar;
