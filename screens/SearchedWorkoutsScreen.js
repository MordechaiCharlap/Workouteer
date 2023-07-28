import { View, FlatList } from "react-native";
import React, { useCallback } from "react";
import { safeAreaStyle } from "../components/safeAreaStyle";
import Header from "../components/Header";
import WorkoutComponent from "../components/WorkoutComponent";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect } from "@react-navigation/native";
import languageService from "../services/languageService";
import useAuth from "../hooks/useAuth";
import { color_outline } from "../utils/appStyleSheet";

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
      <View className="flex-1">
        <FlatList
          data={workouts}
          style={{
            paddingTop: 5,
            borderTopColor: color_outline,
            borderTopWidth: 1,
          }}
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
    </View>
  );
};

export default SearchedWorkoutsScreen;
