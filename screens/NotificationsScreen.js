import { View, Text, StatusBar } from "react-native";
import * as appStyle from "../utils/appStyleSheet";
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
  return <View></View>;
};

export default NotificationsScreen;
