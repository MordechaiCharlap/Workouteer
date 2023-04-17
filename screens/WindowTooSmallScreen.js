import { View, Text } from "react-native";
import React from "react";
import * as appStyle from "../components/AppStyleSheet";
const WindowTooSmallScreen = () => {
  return (
    <View
      className="flex-1 justify-center items-center"
      style={{ backgroundColor: appStyle.color_bg }}
    >
      <Text
        className="text-5xl font-bold text-center"
        style={{ color: appStyle.color_primary }}
      >
        Window is too small, Please increase your browser window size
      </Text>
    </View>
  );
};

export default WindowTooSmallScreen;
