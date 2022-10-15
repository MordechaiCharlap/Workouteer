import { View, StyleSheet } from "react-native";
import React from "react";
import NavbarButton from "./NavbarButton";
import * as appStyle from "./AppStyleSheet";
const BottomNavbar = (props) => {
  return (
    <View
      className="flex-row flex-1 flex-grow-0 bg-slate-200 shrink-0"
      style={style.navStyle}
    >
      <NavbarButton screen="MyUser" currentScreen={props.currentScreen} />
      <NavbarButton screen="Calendar" currentScreen={props.currentScreen} />
      <NavbarButton screen="Home" currentScreen={props.currentScreen} />
      <NavbarButton screen="Friends" currentScreen={props.currentScreen} />
      <NavbarButton screen="Explore" currentScreen={props.currentScreen} />
    </View>
  );
};
const style = StyleSheet.create({
  navStyle: {
    borderTopColor: appStyle.appDarkBlue,
    borderTopWidth: "0.1rem",
  },
});
export default BottomNavbar;
