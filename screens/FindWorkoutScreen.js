import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import Header from "../components/Header";
import WorkoutType from "../components/WorkoutType";
import { useEffect } from "react";
import * as appStyle from "../components/AppStyleSheet";
const FindWorkoutScreen = () => {
  const navigation = useNavigation();
  const [type, setType] = useState(null);
  const [isSearchDisabled, setIsSearchDisabled] = useState(true);
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
        <View className="items-center">
          <TouchableOpacity
            className="px-2 py-1"
            style={{ backgroundColor: appStyle.appAzure }}
          >
            <Text className="text-xl" style={{ color: appStyle.appDarkBlue }}>
              Search
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FindWorkoutScreen;
