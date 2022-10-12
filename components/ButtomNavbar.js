import { View } from "react-native";
import React from "react";
import NavbarButton from "./NavbarButton";

const ButtomNavbar = (props) => {
  return (
    <View className="flex-row flex-1 flex-grow-0 bg-slate-200">
      <NavbarButton
        title="User"
        screen="User"
        currentScreen={props.currentScreen}
      />
      <NavbarButton
        title="Calander"
        screen="Calander"
        currentScreen={props.currentScreen}
      />
      <NavbarButton
        title="Home"
        screen="Home"
        currentScreen={props.currentScreen}
      />
      <NavbarButton
        title="Friends"
        screen="Friends"
        currentScreen={props.currentScreen}
      />
      <NavbarButton
        title="Explore"
        screen="Explore"
        currentScreen={props.currentScreen}
      />
    </View>
  );
};

export default ButtomNavbar;
