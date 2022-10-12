import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const NavbarButton = (props) => {
  const navigation = useNavigation();
  if (props.currentScreen != props.title) {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(props.screen)}
        style={styles.button}
      >
        <Text>{props.screen}</Text>
      </TouchableOpacity>
    );
  }
};
const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#66fcf1",
    padding: 10,
    flex: 1,
    borderColor: "#202832",
    borderWidth: 2,
  },
});

export default NavbarButton;
