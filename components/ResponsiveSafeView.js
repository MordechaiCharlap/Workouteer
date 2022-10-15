import { Platform, StyleSheet } from "react-native";
var safeArea = StyleSheet.create({});
if (Platform.OS == "web") {
  safeArea = StyleSheet.create({
    safeAreaStyle: {
      alignSelf: "center",
      height: "100%",
      aspectRatio: "8 / 18",
    },
  });
} else if (Platform.OS == "android")
  safeArea = StyleSheet.create({
    safeAreaStyle: {
      flex: 1,
      backgroundColor: "white",
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
  });
export default safeArea.safeAreaStyle;
