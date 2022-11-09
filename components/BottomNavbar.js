import { View, StyleSheet, Platform } from "react-native";
import React from "react";
import NavbarButton from "./NavbarButton";
import * as appStyle from "./AppStyleSheet";
const BottomNavbar = (props) => {
  return (
    <View
      className={`flex-row flex-grow-0 shrink-0 h-12 justify-around ${props.display}`}
      style={style.navStyle}
    >
      <NavbarButton screen="MyUser" currentScreen={props.currentScreen} />
      <NavbarButton screen="Calendar" currentScreen={props.currentScreen} />
      <NavbarButton screen="Home" currentScreen={props.currentScreen} />
      <NavbarButton screen="Chats" currentScreen={props.currentScreen} />
      <NavbarButton screen="Explore" currentScreen={props.currentScreen} />
    </View>
  );
};
const style = StyleSheet.create({
  navStyle: {
    backgroundColor: appStyle.appLightBlue,
  },
});
export default BottomNavbar;
