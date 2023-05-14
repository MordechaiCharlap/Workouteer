import { View, StatusBar, FlatList } from "react-native";
import * as appStyle from "../utilities/appStyleSheet";
import React, { useCallback } from "react";
import { safeAreaStyle } from "../components/safeAreaStyle";
import Header from "../components/Header";
import WorkoutComponent from "../components/WorkoutComponent";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect } from "@react-navigation/native";
import languageService from "../services/languageService";
import useAuth from "../hooks/useAuth";

const SearchedWorkoutsScreen = ({ route }) => {
  const { user } = useAuth();
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("SearchedWorkouts");
    }, [])
  );
  const workouts = route.params.workouts;
  return (
    <View style={safeAreaStyle()}>
      <Header
        title={languageService[user.language].results}
        goBackOption={true}
      />
      <FlatList
        className="px-2"
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WorkoutComponent
            location={route.params.location}
            workout={item}
            isPastWorkout={false}
          />
        )}
      />
    </View>
  );
};

export default SearchedWorkoutsScreen;
