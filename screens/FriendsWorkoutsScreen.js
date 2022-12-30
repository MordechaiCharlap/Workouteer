import { View, SafeAreaView } from "react-native";
import responsiveStyle from "../components/ResponsiveStyling";
import Header from "../components/Header";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
const FriendsWorkoutsScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={responsiveStyle.safeAreaStyle}>
      <Header title="Friends workouts" goBackOption={true} />
      <View className="flex-1 px-4"></View>
    </SafeAreaView>
  );
};

export default FriendsWorkoutsScreen;
