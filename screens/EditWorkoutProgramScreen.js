import { View } from "react-native";
import React, { useCallback } from "react";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import languageService from "../services/languageService";
import EditingWorkoutProgram from "../components/workoutProgram/EditingWorkoutProgram";
import { safeAreaStyle } from "../components/safeAreaStyle";
const EditWorkoutProgramScreen = ({ route }) => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { user } = useAuth();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("EditWorkoutProgram");
    }, [])
  );
  return (
    <View style={safeAreaStyle()}>
      <Header
        title={languageService[user.language].updateProgram}
        goBackOption={true}
      />
      <EditingWorkoutProgram program={route.params.program} />
    </View>
  );
};

export default EditWorkoutProgramScreen;
