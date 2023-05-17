import { View, Text, StatusBar } from "react-native";
import React from "react";
import * as appStyle from "../utilities/appStyleSheet";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import useAuth from "../hooks/useAuth";
import languageService from "../services/languageService";
const WindowTooSmallScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { user } = useAuth();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("WindowTooSmall");
    }, [])
  );
  return (
    <View
      className="flex-1 justify-center items-center p-10"
      style={{ backgroundColor: appStyle.color_background }}
    >
      <Text
        className="text-5xl font-bold text-center"
        style={{ color: appStyle.color_primary }}
      >
        {user
          ? languageService[user.language].windowTooSmallMessage
          : "Window is too small, Please increase your browser window size"}
      </Text>
    </View>
  );
};

export default WindowTooSmallScreen;
