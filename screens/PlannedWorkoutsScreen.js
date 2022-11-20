import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import WorkoutType from "../components/WorkoutType";
import WorkoutMinutes from "../components/WorkoutMinutes";
import WorkoutStartingTime from "../components/WorkoutStartingTime";
import WorkoutMaximumWaiting from "../components/WorkoutMaximumWaiting";
import WorkoutDescription from "../components/WorkoutDescription";
import React, { useState, useEffect, useLayoutEffect } from "react";
import * as appStyle from "../components/AppStyleSheet";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { useNavigation } from "@react-navigation/native";
import WorkoutLocation from "../components/WorkoutLocation";
import Header from "../components/Header";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
const PlannedWorkoutsScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1 px-4">
        <Header title="Planned workouts" goBackOption={true} />
      </View>
    </SafeAreaView>
  );
};

export default PlannedWorkoutsScreen;
