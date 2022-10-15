import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as appStyle from "../components/AppStyleSheet";
const NavbarButton = (props) => {
  const navigation = useNavigation();
  if (props.screen != props.currentScreen) {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(props.screen)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{props.screen}</Text>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity style={styles.button}>
        <Text style={styles.selectedButtonText}>{props.screen}</Text>
        <View
          style={{
            backgroundColor: appStyle.appDarkBlue,
            marginTop: "0.2rem",
            height: "0.1rem",
            width: "100%",
            paddingTop: "0.2rem",
          }}
        />
      </TouchableOpacity>
    );
  }
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: appStyle.appLightBlue,
    alignItems: "center",
    padding: 15,
    flex: 1,
  },
  buttonText: {
    color: appStyle.appDarkBlue,
    fontWeight: 400,
  },
  selectedButtonText: {
    fontWeight: 500,
    color: appStyle.appDarkBlue,
  },
});

export default NavbarButton;
