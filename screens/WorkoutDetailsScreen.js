import { View, Text, SafeAreaView } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import responsiveStyle from "../components/ResponsiveStyling";
const WorkoutDetailsScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={responsiveStyle.safeAreaStyle}>
      <Header title={"Details"} />
    </SafeAreaView>
  );
};

export default WorkoutDetailsScreen;
