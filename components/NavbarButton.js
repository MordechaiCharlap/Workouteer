import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const NavbarButton = (props) => {
  const navigation = useNavigation();
  if (props.currentScreen != props.screen) {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(props.screen)}
        style={styles.button}
      >
        <Text>{props.screen}</Text>
      </TouchableOpacity>
    );
  } else {
    console.log("this button is clicked already");
    return (
      <TouchableOpacity style={styles.currentPageButton}>
        <Text>{props.screen}</Text>
      </TouchableOpacity>
    );
  }
};
const styles = StyleSheet.create({
  currentPageButton: {
    alignItems: "center",
    backgroundColor: "#46a29f",
    padding: 10,
    flex: 1,
    borderColor: "#202832",
    borderWidth: 2,
  },
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
