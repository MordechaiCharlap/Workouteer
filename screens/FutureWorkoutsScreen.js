import { View, SafeAreaView, FlatList } from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import responsiveStyle from "../components/ResponsiveStyling";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
import WorkoutComponent from "../components/WorkoutComponent";
import * as geoService from "../services/geoService";
import LoadingAnimation from "../components/LoadingAnimation";
const FutureWorkoutsScreen = () => {
  const { user } = useAuth();
  const now = new Date();
  const [workouts, setWorkouts] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  useEffect(() => {
    const setLocation = async () => {
      const location = await geoService.getCurrentLocation();
      setCurrentLocation(location);
    };
    const getWorkouts = async () => {
      console.log("getting workouts");
      const workoutsArr = await firebase.getFutureWorkouts(user, now);
      setWorkouts(workoutsArr);
      setInitialLoading(false);
    };
    setLocation();
    getWorkouts();
  }, []);

  return (
    <SafeAreaView style={responsiveStyle.safeAreaStyle}>
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
              <WorkoutComponent
                workout={item}
                isPastWorkout={false}
                location={currentLocation}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default FutureWorkoutsScreen;
