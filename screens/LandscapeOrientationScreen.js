import { View, Text, StatusBar } from "react-native";
import React, { useCallback } from "react";
import * as appStyle from "../utilities/appStyleSheet";
import { useFocusEffect } from "@react-navigation/native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import useAuth from "../hooks/useAuth";
import languageService from "../services/languageService";
const LandscapeOrientationScreen = () => {
  const { user } = useAuth();
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
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Text
        className="text-5xl font-bold text-center"
        style={{ color: appStyle.color_primary }}
      >
        {user
          ? languageService[user.language].landscapeModeMessage
          : "App is supported only in portrait mode"}
      </Text>
    </View>
  );
};

export default LandscapeOrientationScreen;
