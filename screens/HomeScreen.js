import { SafeAreaView, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import AddWorkoutButton from "../components/AddWorkoutButton";
import style from "../components/ResponsiveStyling";
import SearchWorkoutButton from "../components/SearchWorkoutButton";
import HomeScreenButton from "../components/HomeScreenButton";
import * as appStyle from "../components/AppStyleSheet";
import { faPlus, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
const HomeScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const buttonStyle = {
    color: appStyle.appGray,
    backgroundColor: appStyle.appAzure,
    buttonSize: 40,
    iconSize: 40,
  };
  return (
    <SafeAreaView style={style.safeAreaStyle}>
      <View className="flex-1">
        <View className="flex-row justify-around p-3">
          <HomeScreenButton
            buttonText="FIND A WORKOUT"
            style={buttonStyle}
            navigateScreen="SearchWorkout"
            icon={faMagnifyingGlass}
          />
          <HomeScreenButton
            buttonText="CREATE WORKOUT"
            style={buttonStyle}
            navigateScreen="NewWorkout"
            icon={faPlus}
          />
        </View>
      </View>
      <BottomNavbar currentScreen="Home" />
    </SafeAreaView>
  );
};

export default HomeScreen;
