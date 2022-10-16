import { SafeAreaView } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import AddWorkoutButton from "../components/AddWorkoutButton";
import safeAreaStyle from "../components/ResponsiveSafeView";
import * as appStyle from "../components/AppStyleSheet";
import UserUpperBanner from "../components/UserUpperBanner";
const HomeScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView style={safeAreaStyle} className="flex-1">
      <UserUpperBanner />
      <AddWorkoutButton />
      <BottomNavbar currentScreen="Home" />
    </SafeAreaView>
  );
};

export default HomeScreen;
