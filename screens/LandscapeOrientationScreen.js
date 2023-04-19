import { View, Text } from "react-native";
import React, { useCallback } from "react";
import * as appStyle from "../components/AppStyleSheet";
import { useFocusEffect } from "@react-navigation/native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
const LandscapeOrientationScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("LandscapeOrientation");
    }, [])
  );
  return (
    <View
      className="flex-1 justify-center items-center"
      style={{ backgroundColor: appStyle.color_bg }}
    >
      <Text
        className="text-5xl font-bold text-center"
        style={{ color: appStyle.color_primary }}
      >
        App is supported only in portrait mode
      </Text>
    </View>
  );
};

export default LandscapeOrientationScreen;
