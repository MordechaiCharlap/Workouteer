import { Platform, StyleSheet, StatusBar } from "react-native";
import * as appStyle from "./AppStyleSheet";
var style = StyleSheet.create({});
if (Platform.OS == "web") {
  style = StyleSheet.create({
    safeAreaStyle: {
      height: "100%",
      flex: 1,
      alignSelf: "center",
      aspectRatio: "9/19",
      backgroundColor: appStyle.appAzure,
    },
    newWorkoutScrollView: {
      backgroundColor: appStyle.appGray,
      width: "90%",
      height: 550,
    },
  });
} else if (Platform.OS == "android")
  style = StyleSheet.create({
    safeAreaStyle: {
      height: "100%",
      flex: 1,
      backgroundColor: appStyle.appAzure,
      paddingTop: StatusBar.currentHeight,
    },
    newWorkoutScrollView: {
      backgroundColor: appStyle.appGray,
      width: "90%",
    },
  });
export default style;

export const ResponsiveShadow =
  Platform.OS == "android" ? "shadow-lg" : "shadow-sm";
