import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import Header from "../components/Header";
import WorkoutType from "../components/WorkoutType";
import WorkoutStartingTime from "../components/WorkoutStartingTime";
import { useEffect } from "react";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
const FindWorkoutScreen = () => {
  const now = new Date();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [type, setType] = useState(0);
  const [isSearchDisabled, setIsSearchDisabled] = useState(true);
  const [minStartingTime, setMinStartingTime] = useState(null);
  const [maxStartingTime, setMaxStartingTime] = useState(null);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  useEffect(() => {
    if (type == null || minStartingTime == null || maxStartingTime == null) {
      setIsSearchDisabled(true);
      console.log("cant search");
    } else {
      setIsSearchDisabled(false);

      console.log("can search");
    }
  }, [type, minStartingTime, maxStartingTime]);
  const minDateChanged = (date) => {
    setMinStartingTime(null);
    setMinStartingTime(date);
  };
  const maxDateChanged = (date) => {
    if (date < minStartingTime) {
      minDateChanged(minStartingTime);
      setMaxStartingTime(null);
    } else {
      setMaxStartingTime(date);
    }
  };
  const showResults = async () => {
    const workouts = await firebase.getWorkoutResults(
      user,
      type,
      minStartingTime,
      maxStartingTime
    );
    navigation.navigate("SearchedWorkouts", {
      workouts: workouts,
      user: user,
    });
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <Header title="Find workout" goBackOption={true} />
      <View className="flex-1 px-4">
        <WorkoutType typeSelected={setType} everythingOption={true} />
        <View className="flex-row justify-around mb-5">
          <StartingTimeComp
            minDate={now}
            title="From"
            startingTimeChanged={(date) => minDateChanged(date)}
          />
          {minStartingTime != null && (
            <StartingTimeComp
              minDate={minStartingTime}
              title="to"
              startingTimeChanged={(date) => maxDateChanged(date)}
            />
          )}
        </View>

        <View className="items-center">
          <TouchableOpacity
            disabled={isSearchDisabled}
            className="px-2 py-1"
            onPress={showResults}
            style={{ backgroundColor: appStyle.appAzure }}
          >
            <Text className="text-2xl" style={{ color: appStyle.appDarkBlue }}>
              Search
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
const StartingTimeComp = (props) => {
  return (
    <View
      className="rounded-xl p-2 pb-4 px-4 items-center"
      style={{ backgroundColor: appStyle.appLightBlue }}
    >
      <Text
        className="text-xl font-semibold"
        style={{ color: appStyle.appDarkBlue }}
      >
        {props.title}
      </Text>
      <WorkoutStartingTime
        startingTimeChanged={props.startingTimeChanged}
        minDate={props.minDate}
      />
    </View>
  );
};
export default FindWorkoutScreen;
