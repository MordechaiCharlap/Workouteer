import { Platform, StyleSheet, StatusBar } from "react-native";
import * as appStyle from "./AppStyleSheet";
import { isWebOnPC } from "../services/webScreenService";
var responsiveStyle;
if (isWebOnPC) {
  responsiveStyle = StyleSheet.create({
    safeAreaStyle: {
      height: window.innerHeight - 50,
      flex: 1,
      alignSelf: "center",
      aspectRatio: "9/19",
      backgroundColor: appStyle.color_bg,
    },
  });
} else {
  responsiveStyle = StyleSheet.create({
    safeAreaStyle: {
      height: "100%",
      flex: 1,
      backgroundColor: appStyle.color_bg,
    },
  });
}

console.log("height:");
console.log(responsiveStyle.safeAreaStyle.height);
export default responsiveStyle;

export const ResponsiveShadow =
  Platform.OS == "android" ? "shadow-lg" : "shadow-sm";
