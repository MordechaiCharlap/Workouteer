import { View, Text, StatusBar } from "react-native";
import React from "react";
import * as appStyle from "../components/AppStyleSheet";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
const WindowTooSmallScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("WindowTooSmall");
    }, [])
  );
  return (
    <View
      className="flex-1 justify-center items-center p-10"
      style={{ backgroundColor: appStyle.color_bg }}
    >
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
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
