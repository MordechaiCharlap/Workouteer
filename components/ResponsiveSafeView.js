import { Platform, StyleSheet, StatusBar } from "react-native";
import * as appStyle from "./AppStyleSheet";
var safeArea = StyleSheet.create({});
if (Platform.OS == "web") {
  safeArea = StyleSheet.create({
    safeAreaStyle: {
      alignSelf: "center",
      height: "100%",
      aspectRatio: "412/915",
      backgroundColor: appStyle.appAzure,
    },
  });
} else if (Platform.OS == "android")
  safeArea = StyleSheet.create({
    safeAreaStyle: {
      flex: 1,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      backgroundColor: appStyle.appAzure,
      backgroundColor: "white",
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
  });
export default safeArea.safeAreaStyle;
