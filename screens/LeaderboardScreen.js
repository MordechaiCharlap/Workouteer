import { View, Text, StatusBar } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { React, useLayoutEffect, useCallback } from "react";
import responsiveStyle from "../components/ResponsiveStyling";
import BottomNavbar from "../components/BottomNavbar";
import * as appStyle from "../components/AppStyleSheet";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
import Header from "../components/Header";
const LeaderboardScreen = () => {
  const { setScreen } = useNavbarNavigation();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });
  useFocusEffect(
    useCallback(() => {
      setScreen("Leaderboard");
    }, [])
  );
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View className="flex-1">
        <Header title="Leaderboard" />
      </View>
      <BottomNavbar currentScreen="Leaderboard" />
    </View>
  );
};

export default LeaderboardScreen;
