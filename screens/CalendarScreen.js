import { View, Text, StatusBar } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { React, useCallback } from "react";
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as appStyle from "../components/AppStyleSheet";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
import Calendar from "../components/Calendar";
const CalendarScreen = () => {
  const { setScreen } = useNavbarNavigation();
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("ChangePreferences");
      setScreen("Calendar");
    }, [])
  );
  return (
    <View style={safeAreaStyle()}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View className="flex-1">
        <Calendar />
      </View>
    </View>
  );
};

export default CalendarScreen;
