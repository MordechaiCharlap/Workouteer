import { View, Text } from "react-native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import Header from "../components/Header";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import languageService from "../services/languageService";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import useFriendsWorkouts from "../hooks/useFriendsWorkouts";
import { FlatList } from "react-native";
import WorkoutComponent from "../components/WorkoutComponent";
import { color_outline, color_surface_variant } from "../utils/appStyleSheet";
import useAlerts from "../hooks/useAlerts";
import * as firebase from "../services/firebase";
import { getMemberStatus } from "../utils/workoutUtils";
const FriendsWorkoutsScreen = () => {
  const { friendsWorkouts } = useFriendsWorkouts();
  const { workoutInvitesAlerts } = useAlerts();
  const { user } = useAuth();
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("FriendsWorkouts");
    }, [])
  );
  // useEffect(() => {
  //   const getCurrentLocation = async () => {
  //     await geoService.getCurrentLocation(user);
  //   };
  //   getCurrentLocation(user);
  // }, []);
  // useEffect(() => {
  //   const getWorkoutsByInvites = async () => {
  //     const workoutsArr = await firebase.getWorkoutsByInvites(
  //       workoutInvitesAlerts
  //     );
  //     setWorkouts(workoutsArr);
  //     setInitialLoading(false);
  //   };
  //   getWorkoutsByInvites();
  // }, []);
  return (
    <View style={safeAreaStyle()}>
      <Header
        title={languageService[user.language].friendsWorkouts}
        goBackOption={true}
      />
      <View
        className="flex-1"
        style={{ backgroundColor: color_surface_variant }}
      >
        <FlatList
          style={{
            paddingTop: 5,
          }}
          // showsVerticalScrollIndicator={false}
          data={friendsWorkouts}
          contentContainerStyle={{ rowGap: 5 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WorkoutComponent workout={item} screen={"FriendsWorkouts"} />
          )}
        />
      </View>
    </View>
  );
};

export default FriendsWorkoutsScreen;
