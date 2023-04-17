import { View, Text, StatusBar, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import safeAreaStyle from "../components/safeAreaStyle";
import * as appStyle from "../components/AppStyleSheet";
import WorkoutComponent from "../components/WorkoutComponent";
import Header from "../components/Header";
import LoadingAnimation from "../components/LoadingAnimation";
import * as firebase from "../services/firebase";
import useAlerts from "../hooks/useAlerts";
import languageService from "../services/languageService";
import useAuth from "../hooks/useAuth";
import useNavbarDisplay from "../hooks/useNavbarDisplay";

const WorkoutInvitesScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState();
  const [initialLoading, setInitialLoading] = useState(true);
  const { workoutInvitesAlerts } = useAlerts();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("WorkoutInvites");
    }, [])
  );
  useEffect(() => {
    const getWorkoutsByInvites = async () => {
      const workoutsArr = await firebase.getWorkoutsByInvites(
        workoutInvitesAlerts
      );
      setWorkouts(workoutsArr);
      setInitialLoading(false);
    };
    getWorkoutsByInvites();
  }, []);
  return (
    <View style={safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Header
        title={languageService[user.language].workoutInvites}
        goBackOption={true}
      />
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
                screen={"WorkoutInvites"}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default WorkoutInvitesScreen;
