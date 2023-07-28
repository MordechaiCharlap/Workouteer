import { View, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import WorkoutComponent from "../components/WorkoutComponent";
import Header from "../components/Header";
import LoadingAnimation from "../components/LoadingAnimation";
import * as firebase from "../services/firebase";
import useAlerts from "../hooks/useAlerts";
import languageService from "../services/languageService";
import useAuth from "../hooks/useAuth";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import * as geoService from "../services/geoService";
import { color_outline, color_surface_variant } from "../utils/appStyleSheet";

const WorkoutInvitesScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState();
  const { workoutInvitesAlerts } = useAlerts();
  const [initialLoading, setInitialLoading] = useState(true);
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
    <View style={safeAreaStyle()}>
      <Header
        title={languageService[user.language].workoutInvites}
        goBackOption={true}
      />
      <View
        className="flex-1"
        style={{ backgroundColor: color_surface_variant }}
      >
        {initialLoading ? (
          <LoadingAnimation />
        ) : (
          <FlatList
            style={{
              paddingTop: 5,
              borderTopColor: color_outline,
              borderTopWidth: 1,
            }}
            // showsVerticalScrollIndicator={false}
            data={workouts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <WorkoutComponent
                userMemberStatus={"invited"}
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
