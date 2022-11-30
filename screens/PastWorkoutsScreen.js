import { View, SafeAreaView, FlatList } from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import responsiveStyle from "../components/ResponsiveStyling";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
import WorkoutComponent from "../components/WorkoutComponent";
const FutureWorkoutsScreen = () => {
  const { user } = useAuth();
  const now = new Date();
  const [workouts, setWorkouts] = useState([]);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  useEffect(() => {
    const getWorkouts = async () => {
      console.log("getting workouts");
      const workoutsArr = await firebase.getPastWorkouts(user, now);
      console.log(workoutsArr);
      setWorkouts(workoutsArr);
    };
    getWorkouts();
  }, []);
  return (
    <SafeAreaView style={responsiveStyle.safeAreaStyle}>
      <Header title="Past workouts" goBackOption={true} />
      <View className="flex-1 px-4">
        <FlatList
          className="p-2"
          showsVerticalScrollIndicator={false}
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WorkoutComponent workout={item} isPastWorkout={true} />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default FutureWorkoutsScreen;
