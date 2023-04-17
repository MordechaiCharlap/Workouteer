import { View } from "react-native";
import React from "react";
import NavbarButton from "./NavbarButton";
import * as appStyle from "./AppStyleSheet";
import useAlerts from "../hooks/useAlerts";
import useWebResponsiveness from "../hooks/useWebResponsiveness";
const BottomNavbar = () => {
  const { chatsAlerts, friendRequestsAlerts } = useAlerts();
  const { windowHeight } = useWebResponsiveness();
  return (
    <View
      className="items-center"
      style={{ height: 50, backgroundColor: "#f2f2f2" }}
    >
      <View
        className={`flex-row justify-around`}
        style={{
          height: "100%",
          width: (9 / 19) * (windowHeight ? windowHeight : window.innerHeight),
          backgroundColor: appStyle.color_primary,
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
