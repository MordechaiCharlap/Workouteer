import { Platform, StyleSheet, StatusBar } from "react-native";
import * as appStyle from "./AppStyleSheet";
var responsiveStyle;
if (Platform.OS == "web") {
  responsiveStyle = StyleSheet.create({
    safeAreaStyle: {
      height: "100%",
      flex: 1,
      alignSelf: "center",
      aspectRatio: "9/19",
      backgroundColor: appStyle.color_bg,
    },
  });
} else if (Platform.OS == "android")
  responsiveStyle = StyleSheet.create({
    safeAreaStyle: {
      height: "100%",
      flex: 1,
      backgroundColor: appStyle.color_bg,
    },
  });
export default responsiveStyle;

export const ResponsiveShadow =
  Platform.OS == "android" ? "shadow-lg" : "shadow-sm";
