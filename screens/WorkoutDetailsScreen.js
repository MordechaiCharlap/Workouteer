import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import responsiveStyle from "../components/ResponsiveStyling";
import useAuth from "../hooks/useAuth";
import * as appStyle from "../components/AppStyleSheet";
import { timeString } from "../services/timeFunctions";
const WorkoutDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const workout = route.params.workout;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={responsiveStyle.safeAreaStyle}>
      <Header title={"Details"} goBackOption={true} />
      <View className="flex-1 px-4">
        <ScrollView
          style={{ backgroundColor: appStyle.appLightBlue }}
          className="flex-1 rounded"
        >
          <Text>Date: {timeString(workout.startingTime.toDate())}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default WorkoutDetailsScreen;
