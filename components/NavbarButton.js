import React from "react";
import { Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const NavbarButton = (props) => {
  const navigation = useNavigation();
  if (props.currentScreen != props.title) {
    return (
      <Button
        title={props.title}
        onPress={() => navigation.navigate(props.screen)}
        className="bg-green-500"
      />
    );
  } else return <Button title={props.title} className="bg-green-500" />;
};

export default NavbarButton;
