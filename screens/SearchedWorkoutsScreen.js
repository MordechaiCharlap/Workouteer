import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import Header from "../components/Header";
import WorkoutType from "../components/WorkoutType";
import WorkoutStartingTime from "../components/WorkoutStartingTime";
import { useEffect } from "react";
import * as appStyle from "../components/AppStyleSheet";
import { FlatList } from "react-native-gesture-handler";
import WorkoutComponent from "../components/WorkoutComponent";
const SearchedWorkoutsScreen = ({ route }) => {
  const now = new Date();
  const workouts = route.params.workouts;
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <Header title="Results" goBackOption={true} />
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WorkoutComponent
            now={now}
            workout={item}
            user={route.params.user}
            isPastWorkout={false}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default SearchedWorkoutsScreen;
