import React from "react";
import { Button, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const NavbarButton = (props) => {
  const navigation = useNavigation();
  if (props.currentScreen != props.title) {
    return (
      <Button
        title={props.screen}
        onPress={() => navigation.navigate(props.screen)}
        className="flex-1"
      />
    );
  } else return <Button title={props.screen} className="bg-green-500" />;
};

export default NavbarButton;
