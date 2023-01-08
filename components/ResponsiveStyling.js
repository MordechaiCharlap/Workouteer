import { Platform, StyleSheet, StatusBar } from "react-native";
import * as Device from "expo-device";
import * as appStyle from "./AppStyleSheet";
var style;
if (Platform.OS == "web") {
  style = StyleSheet.create({
    safeAreaStyle: {
      height: "100%",
      flex: 1,
      alignSelf: "center",
      aspectRatio: "9/19",
      backgroundColor: appStyle.color_bg,
    },
  });
} else if (Platform.OS == "android")
  style = StyleSheet.create({
    safeAreaStyle: {
      height: "100%",
      flex: 1,
      backgroundColor: appStyle.color_bg,
    },
  });
export default style;

export const ResponsiveShadow =
  Platform.OS == "android" ? "shadow-lg" : "shadow-sm";
