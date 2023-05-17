import { View, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import NavbarButton from "./NavbarButton";
import * as appStyle from "../utilities/appStyleSheet";
import useAlerts from "../hooks/useAlerts";
import useResponsiveness from "../hooks/useResponsiveness";
import { isWebOnPC } from "../services/webScreenService";
const BottomNavbar = () => {
  const { chatsAlerts, friendRequestsAlerts } = useAlerts();
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
        backgroundColor: appStyle.color_background,
      }}
    >
      <View
        className={`flex-row justify-around h-full`}
        style={{
          width: fixedWidth,
          backgroundColor: appStyle.color_background_variant,
        }}
      >
        <NavbarButton
          screen="MyUser"
          alert={Object.keys(friendRequestsAlerts).length > 0}
        />
        <NavbarButton screen="Leaderboard" />
        <NavbarButton screen="Home" />
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
