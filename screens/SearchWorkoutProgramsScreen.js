import { View, Text } from "react-native";
import React from "react";
import useAuth from "../hooks/useAuth";
import useFirebase from "../hooks/useFirebase";

const SearchWorkoutProgramsScreen = () => {
  const { user } = useAuth();
  const { db } = useFirebase();
  return <View className="flex-1"></View>;
};

export default SearchWorkoutProgramsScreen;
