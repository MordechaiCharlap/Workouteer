import { SafeAreaView, View, Text } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import Header from "../components/Header";
const SearchWorkoutScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1">
        <Header title="Find workout" goBackOption={true} />
      </View>
    </SafeAreaView>
  );
};

export default SearchWorkoutScreen;
