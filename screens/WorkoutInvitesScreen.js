import { View, Text, StatusBar, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as appStyle from "../utilities/appStyleSheet";
import WorkoutComponent from "../components/WorkoutComponent";
import Header from "../components/Header";
import LoadingAnimation from "../components/LoadingAnimation";
import * as firebase from "../services/firebase";
import useAlerts from "../hooks/useAlerts";
import languageService from "../services/languageService";
import useAuth from "../hooks/useAuth";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import * as geoService from "../services/geoService";

const WorkoutInvitesScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState();
  const { workoutInvitesAlerts } = useAlerts();
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState();

  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("WorkoutInvites");
    }, [])
  );
  useEffect(() => {
    const getCurrentLocation = async () => {
      const location = await geoService.getCurrentLocation();
      setCurrentLocation(location);
    };
    const getWorkoutsByInvites = async () => {
      const workoutsArr = await firebase.getWorkoutsByInvites(
        workoutInvitesAlerts
      );
      setWorkouts(workoutsArr);
      setInitialLoading(false);
    };
    // getCurrentLocation();
    getWorkoutsByInvites();
  }, []);
  return (
    <View style={safeAreaStyle()}>
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
                location={currentLocation}
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
