import { View, FlatList, StatusBar } from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import responsiveStyle from "../components/ResponsiveStyling";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import * as firebase from "../services/firebase";
import * as appStyle from "../components/AppStyleSheet";
import useAuth from "../hooks/useAuth";
import WorkoutComponent from "../components/WorkoutComponent";
import LoadingAnimation from "../components/LoadingAnimation";
const FutureWorkoutsScreen = () => {
  const { user } = useAuth();
  const now = new Date();
  const [workouts, setWorkouts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  useEffect(() => {
    const getWorkouts = async () => {
      console.log("getting workouts");
      const workoutsArr = await firebase.getFutureWorkouts(user, now);
      setWorkouts(workoutsArr);
      setInitialLoading(false);
    };
    getWorkouts();
  }, []);

  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Header title="Future workouts" goBackOption={true} />
      <View className="flex-1 px-4">
        {initialLoading ? (
          <LoadingAnimation />
        ) : (
          <FlatList
            className="p-2"
            showsVerticalScrollIndicator={false}
            data={workouts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <WorkoutComponent workout={item} isPastWorkout={false} />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default FutureWorkoutsScreen;
