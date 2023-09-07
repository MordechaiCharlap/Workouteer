import { View } from "react-native";
import React, { useCallback } from "react";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import EditingWorkoutProgram from "../components/workoutProgram/EditingWorkoutProgram";
import { WorkoutProgramProvider } from "../hooks/useWorkoutProgram";
const CreateWorkoutProgramScreen = ({ route }) => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("CreateWorkoutProgram");
    }, [])
  );
  return (
    <View style={safeAreaStyle()}>
      <WorkoutProgramProvider>
        <EditingWorkoutProgram programName={route.params.programName} />
      </WorkoutProgramProvider>
    </View>
  );
};

export default CreateWorkoutProgramScreen;
