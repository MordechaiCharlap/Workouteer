import { SafeAreaView, View, Text } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import Header from "../components/Header";
import WorkoutType from "../components/WorkoutType";
const FindWorkoutScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <Header title="Find workout" goBackOption={true} />
      <View className="flex-1 px-4">
        <WorkoutType />
      </View>
    </SafeAreaView>
  );
};

export default FindWorkoutScreen;
