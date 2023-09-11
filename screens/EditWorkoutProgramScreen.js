import { View } from "react-native";
import React, { useCallback } from "react";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect } from "@react-navigation/native";
import EditingWorkoutProgram from "../components/workoutProgram/EditingWorkoutProgram";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { WorkoutProgramProvider } from "../hooks/useWorkoutProgram";
const EditWorkoutProgramScreen = ({ route }) => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("EditWorkoutProgram");
    }, [])
  );
  return (
    <View style={safeAreaStyle()}>
      <WorkoutProgramProvider>
        <EditingWorkoutProgram program={route.params.program} />
      </WorkoutProgramProvider>
    </View>
  );
};

export default EditWorkoutProgramScreen;
