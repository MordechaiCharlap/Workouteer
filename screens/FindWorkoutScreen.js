import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import Header from "../components/Header";
import WorkoutType from "../components/WorkoutType";
import WorkoutStartingTime from "../components/WorkoutStartingTime";
import { useEffect } from "react";
import * as appStyle from "../components/AppStyleSheet";
const FindWorkoutScreen = () => {
  const now = new Date();
  const navigation = useNavigation();
  const [type, setType] = useState(null);
  const [isSearchDisabled, setIsSearchDisabled] = useState(true);
  const [minStartingTime, setMinStartingTime] = useState(null);
  const [maxStartingTime, setMaxStartingTime] = useState(null);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  useEffect(() => {
    if (type != null) setIsSearchDisabled(false);
    else {
      setIsSearchDisabled(true);
    }
  }, [type]);
  const minDateChanged = (date) => {
    setMinStartingTime(null);
    setMinStartingTime(date);
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
              startingTimeChanged={setMaxStartingTime}
            />
          )}
        </View>

        <View className="items-center">
          <TouchableOpacity
            className="px-2 py-1"
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
