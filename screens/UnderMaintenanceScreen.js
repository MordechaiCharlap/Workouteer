import { View, Text, Image } from "react-native";
import React, { useCallback } from "react";
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as appStyle from "../utilities/appStyleSheet";
import useAuth from "../hooks/useAuth";
import languageService from "../services/languageService";
import { useFocusEffect } from "@react-navigation/native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
const UnderMaintenanceScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { user } = useAuth();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("UnderMaintenance");
    }, [])
  );
  return (
    <View
      style={safeAreaStyle()}
      className="justify-center items-center gap-y-4 px-4"
    >
      <View
        className="rounded-lg p-2 gap-y-5 self-center w-11/12 items-center"
        style={{
          backgroundColor: appStyle.color_surface,
          borderWidth: 0.5,
          borderColor: appStyle.color_outline,
        }}
      >
        <Image
          className="w-20 h-20"
          source={require("../assets/app-icon.png")}
        />
        <Text
          className="text-2xl text-center"
          style={{ color: appStyle.color_on_surface }}
        >
          {user
            ? languageService[user.language].appIsUnderMaintenance
            : "The app is under maintenance"}
        </Text>
        <Text
          className="text-xl text-center"
          style={{ color: appStyle.color_on_surface }}
        >
          {user
            ? languageService[user.language].comeBackLater
            : "Come back later :)"}
        </Text>
      </View>
    </View>
  );
};

export default UnderMaintenanceScreen;
