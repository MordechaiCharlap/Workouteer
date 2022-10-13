import { View, Text, SafeAreaView, Image } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import AddWorkoutButton from "../components/AddWorkoutButton";
import SafeViewAndroid from "../components/SafeViewAndroid";
import SystemNavigationBar from "react-native-system-navigation-bar";

const HomeScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    SystemNavigationBar.navigationHide();
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView
      style={SafeViewAndroid.AndroidSafeArea}
      className="bg-cyan-900 flex-1"
    >
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

      <BottomNavbar currentScreen="Home" />
    </SafeAreaView>
  );
};

export default HomeScreen;
