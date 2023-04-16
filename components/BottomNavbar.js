import { View } from "react-native";
import React from "react";
import NavbarButton from "./NavbarButton";
import * as appStyle from "./AppStyleSheet";
import useAlerts from "../hooks/useAlerts";
const BottomNavbar = (props) => {
  const { chatsAlerts, friendRequestsAlerts } = useAlerts();
  return (
    <View className="items-center" style={{ backgroundColor: "#f2f2f2" }}>
      <View
        className={`flex-row flex-grow-0 shrink-0 justify-around`}
        style={{
          width: props.width != null ? props.width : "100%",
          backgroundColor: appStyle.color_primary,
          height: props.height,
          borderTopWidth: 1,
          borderTopColor: appStyle.color_bg_variant,
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
        {/* <NavbarButton screen="Explore" /> */}
      </View>
    </View>
  );
};
export default BottomNavbar;
