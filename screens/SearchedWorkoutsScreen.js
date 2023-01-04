import { View, StatusBar } from "react-native";
import * as appStyle from "../components/AppStyleSheet";
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
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
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
    </View>
  );
};

export default SearchedWorkoutsScreen;
