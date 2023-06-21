import { View, Text } from "react-native";
import React from "react";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import useAuth from "../hooks/useAuth";
import * as appStyle from "../utils/appStyleSheet";
import languageService from "../services/languageService";
const ConnectToInternetScreen = () => {
  const { user } = useAuth();
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("ConnectToInternet");
    }, [])
  );
  return (
    <View
      className="justify-center items-center gap-y-4 px-4"
      style={safeAreaStyle()}
    >
      <Text
        className="text-5xl font-bold text-center"
        style={{ color: appStyle.color_primary }}
      >
        {user
          ? languageService[user.language].appRequiresInternetConnection
          : "The app requires internet connection to work"}
      </Text>
      <Text
        className="text-3xl font-bold text-center"
        style={{ color: appStyle.color_primary }}
      >
        {user
          ? languageService[user.language].landscapeModeMessage
          : "Connect and try again :)"}
      </Text>
    </View>
  );
};

export default ConnectToInternetScreen;
