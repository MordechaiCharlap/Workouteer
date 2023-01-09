import { View, Text, StatusBar } from "react-native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import responsiveStyle from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import WorkoutComponent from "../components/WorkoutComponent";
import Header from "../components/Header";
import LoadingAnimation from "../components/LoadingAnimation";
import * as firebase from "../services/firebase";
import useAlerts from "../hooks/useAlerts";
const WorkoutInvitesScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const [workouts, setWorkouts] = useState();
  const [initialLoading, setInitialLoading] = useState(true);
  const { workoutInvites } = useAlerts();
  useEffect(() => {
    const getInvitedWorkouts = async () => {
      const workoutsArr = await firebase.getInvitedWorkouts(workoutInvites);
      setWorkouts(workoutsArr);
      setInitialLoading(false);
    };
    getInvitedWorkouts();
  }, []);
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Header title={"Friends Workouts"} goBackOption={true} />
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

export default WorkoutInvitesScreen;
