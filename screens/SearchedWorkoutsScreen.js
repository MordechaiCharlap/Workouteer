import { SafeAreaView } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import responsiveStyle from "../components/ResponsiveStyling";
import Header from "../components/Header";
import { FlatList } from "react-native-gesture-handler";
import WorkoutComponent from "../components/WorkoutComponent";
const SearchedWorkoutsScreen = ({ route }) => {
  const workouts = route.params.workouts;
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={responsiveStyle.safeAreaStyle}>
      <Header title="Results" goBackOption={true} />
      <FlatList
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
    </SafeAreaView>
  );
};

export default SearchedWorkoutsScreen;
