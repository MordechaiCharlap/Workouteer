import { SafeAreaView, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import AddWorkoutButton from "../components/AddWorkoutButton";
import style from "../components/ResponsiveStyling";
import SearchWorkoutButton from "../components/SearchWorkoutButton";

const HomeScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={style.safeAreaStyle}>
      <View className="flex-1">
        <View className="flex-row justify-around p-3">
          <AddWorkoutButton />
          <SearchWorkoutButton />
          <FriendsWorkoutsButton />
        </View>
      </View>
      <BottomNavbar currentScreen="Home" display={navDisplay} />
    </SafeAreaView>
  );
};

export default HomeScreen;
