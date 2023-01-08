import { View } from "react-native";
import React from "react";
import NavbarButton from "./NavbarButton";
import * as appStyle from "./AppStyleSheet";
import useAlerts from "../hooks/useAlerts";
const BottomNavbar = (props) => {
  const {
    chatsAlerts,
    workoutRequestsAlerts,
    workoutInvitesAlerts,
    friendRequestsAlerts,
  } = useAlerts();
  return (
    <View
      className={`flex-row flex-grow-0 shrink-0 h-12 justify-around ${props.display}`}
      style={{ backgroundColor: appStyle.color_primary }}
    >
      <NavbarButton screen="MyUser" currentScreen={props.currentScreen} />
      <NavbarButton screen="Calendar" currentScreen={props.currentScreen} />
      <NavbarButton
        screen="Home"
        currentScreen={props.currentScreen}
        alert={workoutRequestsAlerts || workoutInvitesAlerts}
      />
      <NavbarButton
        screen="Chats"
        currentScreen={props.currentScreen}
        alert={Object.keys(chatsAlerts).length != 0}
      />
      <NavbarButton
        screen="Explore"
        currentScreen={props.currentScreen}
        alert={friendRequestsAlerts}
      />
    </View>
  );
};
export default BottomNavbar;
