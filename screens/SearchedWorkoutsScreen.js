import { View, StatusBar, FlatList } from "react-native";
import * as appStyle from "../components/AppStyleSheet";
import React, { useCallback } from "react";
import { safeAreaStyle } from "../components/safeAreaStyle";
import Header from "../components/Header";
import WorkoutComponent from "../components/WorkoutComponent";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect } from "@react-navigation/native";

const SearchedWorkoutsScreen = ({ route }) => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("SearchedWorkouts");
    }, [])
  );
  const workouts = route.params.workouts;
  return (
    <View style={safeAreaStyle()}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Header title="Results" goBackOption={true} />
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
