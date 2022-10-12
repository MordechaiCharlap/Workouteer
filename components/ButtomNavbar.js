import { FlatList, View } from "react-native";
import React from "react";
import NavbarButton from "./NavbarButton";

const data = [
  {
    id: "1",
    screen: "User",
  },
  {
    id: "2",
    screen: "Calander",
  },
  {
    id: "3",
    screen: "Home",
  },
  {
    id: "4",
    screen: "Friends",
  },
  {
    id: "5",
    screen: "Explore",
  },
];

const ButtomNavbar = (props) => {
  return (
    <View className="flex-row flex-1 flex-grow-0 bg-slate-200">
      <NavbarButton screen="User" currentScreen={props.currentScreen} />
      <NavbarButton screen="Calander" currentScreen={props.currentScreen} />
      <NavbarButton screen="Home" currentScreen={props.currentScreen} />
      <NavbarButton screen="Friends" currentScreen={props.currentScreen} />
      <NavbarButton screen="Explore" currentScreen={props.currentScreen} />
    </View>
  );
};

export default ButtomNavbar;
