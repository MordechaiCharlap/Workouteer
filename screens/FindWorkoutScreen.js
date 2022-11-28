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
  const navigation = useNavigation();
  const [type, setType] = useState(null);
  const [isSearchDisabled, setIsSearchDisabled] = useState(true);
  const [minStartingTime, setMinStartingTime] = useState(true);
  const [maxStartingTime, setMaxStartingTime] = useState(true);
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
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <Header title="Find workout" goBackOption={true} />
      <View className="flex-1 px-4">
        <WorkoutType typeSelected={setType} />
        <View className="mb-5">
          <View
            className="rounded pt-2 pb-4"
            style={{ backgroundColor: appStyle.appLightBlue }}
          >
            <Text
              className="text-xl font-semibold ml-4"
              style={{ color: appStyle.appDarkBlue }}
            >
              From
            </Text>
            <WorkoutStartingTime startingTimeChanged={setMinStartingTime} />
          </View>
        </View>
        <View className="mb-5">
          <View
            className="rounded pt-2 pb-4"
            style={{ backgroundColor: appStyle.appLightBlue }}
          >
            <Text
              className="text-xl font-semibold ml-4"
              style={{ color: appStyle.appDarkBlue }}
            >
              to
            </Text>
            <WorkoutStartingTime startingTimeChanged={setMinStartingTime} />
          </View>
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

export default FindWorkoutScreen;
