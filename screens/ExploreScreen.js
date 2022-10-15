import { SafeAreaView, Text, View } from "react-native";
import { React, useLayoutEffect } from "react";
import SafeAreaViewStyle from "../components/ResponsiveSafeView";
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
<<<<<<< HEAD
    <SafeAreaView style={SafeAreaViewStyle} className="flex-1">
=======
    <SafeAreaView style={SafeAreaViewStyle} className="bg-slate-700 flex-1">
>>>>>>> 5ebffa71be898c9a7c7bad5e14098063df8e6a58
      <View className="flex-1"></View>
      <BottomNavbar currentScreen="Explore" />
    </SafeAreaView>
  );
};

export default ExploreScreen;
