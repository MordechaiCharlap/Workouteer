import { View } from "react-native";
import React, { createContext, useCallback } from "react";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import EditingWorkoutProgram from "../components/workoutProgram/EditingWorkoutProgram";
export const ProgramContext = createContext();
const CreateWorkoutProgramScreen = ({ route }) => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("CreateWorkoutProgram");
    }, [])
  );
  return (
    <View style={safeAreaStyle()}>
      <EditingWorkoutProgram programName={route.params.programName} />
    </View>
  );
};

export default CreateWorkoutProgramScreen;
