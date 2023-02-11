import { View, FlatList, StatusBar } from "react-native";
import React, { useState, useEffect } from "react";
import responsiveStyle from "../components/ResponsiveStyling";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import * as firebase from "../services/firebase";
import WorkoutComponent from "../components/WorkoutComponent";
import LoadingAnimation from "../components/LoadingAnimation";
import * as appStyle from "../components/AppStyleSheet";
import languageService from "../services/languageService";
const PastWorkoutScreen = ({ route }) => {
  const user = route.params.user;
  const now = new Date();
  const [workouts, setWorkouts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigation = useNavigation();
  useEffect(() => {
    const getWorkouts = async () => {
      const workoutsArr = await firebase.getPastWorkouts(user, now);
      setWorkouts(workoutsArr);
      setInitialLoading(false);
    };
    getWorkouts();
  }, []);
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Header
        title={languageService[user.language].pastWorkouts}
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
              <WorkoutComponent workout={item} isPastWorkout={true} />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default PastWorkoutScreen;
