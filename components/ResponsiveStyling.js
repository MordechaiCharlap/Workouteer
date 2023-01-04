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
      backgroundColor: appStyle.appDarkBlue,
    },
  });
} else if (Platform.OS == "android")
  if (Device.isDevice) {
    style = StyleSheet.create({
      safeAreaStyle: {
        height: "100%",
        flex: 1,
        backgroundColor: appStyle.appDarkBlue,
        borderTopColor: appStyle.appLightBlue,
        borderTopWidth: StatusBar.currentHeight,
      },
    });
  } else {
    style = StyleSheet.create({
      safeAreaStyle: {
        height: "100%",
        flex: 1,
        backgroundColor: appStyle.appDarkBlue,
      },
    });
  }

export default style;

export const ResponsiveShadow =
  Platform.OS == "android" ? "shadow-lg" : "shadow-sm";
