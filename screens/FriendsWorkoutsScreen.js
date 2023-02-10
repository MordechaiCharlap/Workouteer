import { View, StatusBar } from "react-native";
import responsiveStyle from "../components/ResponsiveStyling";
import Header from "../components/Header";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import * as appStyle from "../components/AppStyleSheet";
import languageService from "../services/languageService";
const FriendsWorkoutsScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Header
        title={languageService[user.language].friendsWorkouts}
        goBackOption={true}
      />
      <View className="flex-1 px-4"></View>
    </View>
  );
};

export default FriendsWorkoutsScreen;
