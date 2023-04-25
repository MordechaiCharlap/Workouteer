import { View, Text, StatusBar } from "react-native";
import * as appStyle from "../utilities/appStyleSheet";
import React, { useCallback } from "react";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect } from "@react-navigation/native";

const NotificationsScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Notifications");
    }, [])
  );
  return (
    <View>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
    </View>
  );
};

export default NotificationsScreen;
