<<<<<<< HEAD
import { SafeAreaView } from "react-native";
=======
import { View, Text, SafeAreaView, Image } from "react-native";
>>>>>>> 5ebffa71be898c9a7c7bad5e14098063df8e6a58
import React, { useEffect, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import AddWorkoutButton from "../components/AddWorkoutButton";
import safeAreaStyle from "../components/ResponsiveSafeView";
<<<<<<< HEAD
import * as appStyle from "../components/AppStyleSheet";
import UserUpperBanner from "../components/UserUpperBanner";
=======
>>>>>>> 5ebffa71be898c9a7c7bad5e14098063df8e6a58
const HomeScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
<<<<<<< HEAD
    <SafeAreaView style={safeAreaStyle} className=" flex-1">
      <UserUpperBanner />
      <AddWorkoutButton />
=======
    <SafeAreaView style={safeAreaStyle} className="bg-cyan-900 flex-1">
      <View className="flex-1">
        <View className="flex-row pb-3 items-center mx-4 space-x-2">
          <Image
            source={{
              uri: "https://i.pinimg.com/564x/39/44/28/394428dcf049dbc614b3a34cef24c164.jpg",
            }}
            className="h-10 w-10 bg-white rounded-full"
          />
          <View>
            <Text className="font-bold text-gray-400 text-xs">
              Chad Chadidovich
            </Text>
            <Text className="font-bold text-lg">Find a workout buddy</Text>
          </View>
        </View>
        <AddWorkoutButton />
      </View>

>>>>>>> 5ebffa71be898c9a7c7bad5e14098063df8e6a58
      <BottomNavbar currentScreen="Home" />
    </SafeAreaView>
  );
};

export default HomeScreen;
