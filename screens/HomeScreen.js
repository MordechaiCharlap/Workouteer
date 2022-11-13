import { SafeAreaView, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import AddWorkoutButton from "../components/AddWorkoutButton";
import style from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import UserUpperBanner from "../components/UserUpperBanner";
import SearchWorkoutButton from "../components/SearchWorkoutButton";

const HomeScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const [navDisplay, setNavDisplay] = useState("block");
  const changeNavDisplay = () => {
    if (navDisplay == "block") setNavDisplay("hidden");
    else {
      setNavDisplay("block");
    }
  };
  return (
    <SafeAreaView style={style.safeAreaStyle}>
      <View className="flex-1">
        <View className="flex-row justify-around p-3">
          <AddWorkoutButton hideNavBar={changeNavDisplay} />
          <SearchWorkoutButton />
        </View>
      </View>
      <BottomNavbar currentScreen="Home" display={navDisplay} />
    </SafeAreaView>
  );
};

export default HomeScreen;
