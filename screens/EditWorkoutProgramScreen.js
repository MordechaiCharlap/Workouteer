import { View } from "react-native";
import React, { useCallback } from "react";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect } from "@react-navigation/native";
import EditingWorkoutProgram from "../components/workoutProgram/EditingWorkoutProgram";
import { safeAreaStyle } from "../components/safeAreaStyle";
const EditWorkoutProgramScreen = ({ route }) => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("EditWorkoutProgram");
    }, [])
  );
  return (
    <View style={safeAreaStyle()}>
      <EditingWorkoutProgram program={route.params.program} />
    </View>
  );
};

export default EditWorkoutProgramScreen;
