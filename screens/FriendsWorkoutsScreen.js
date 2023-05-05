import { View, StatusBar } from "react-native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import Header from "../components/Header";
import React, { useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import * as appStyle from "../utilities/appStyleSheet";
import languageService from "../services/languageService";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import useFriendsWorkouts from "../hooks/useFriendsWorkouts";
import { FlatList } from "react-native";
import WorkoutComponent from "../components/WorkoutComponent";
const FriendsWorkoutsScreen = () => {
  const { friendsWorkouts, setFriendsWorkouts } = useFriendsWorkouts();
  const { user } = useAuth();
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("FriendsWorkouts");
    }, [])
  );
  return (
    <View style={safeAreaStyle()}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Header
        title={languageService[user.language].friendsWorkouts}
        goBackOption={true}
      />
      <View className="flex-1 px-4">
        <FlatList
          className="p-2"
          showsVerticalScrollIndicator={false}
          data={friendsWorkouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WorkoutComponent
              workout={item}
              isPastWorkout={false}
              screen={"FriendsWorkouts"}
            />
          )}
        />
      </View>
    </View>
  );
};

export default FriendsWorkoutsScreen;
