import { SafeAreaView, Text, View } from "react-native";
import { React, useLayoutEffect } from "react";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
const ExploreScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle} className="flex-1">
      <View className="flex-1"></View>
      <BottomNavbar currentScreen="Explore" />
    </SafeAreaView>
  );
};

export default ExploreScreen;
