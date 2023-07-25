import { View, FlatList } from "react-native";
import React, { createContext, useCallback, useRef, useState } from "react";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import CustomText from "../components/basic/CustomText";
import CustomTextInput from "../components/basic/CustomTextInput";
import * as appStyle from "../utils/appStyleSheet";
import Header from "../components/Header";
import CustomButton from "../components/basic/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import EditingWorkout from "../components/workoutProgram/EditingWorkout";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import useAuth from "../hooks/useAuth";
import useFirebase from "../hooks/useFirebase";
import languageService from "../services/languageService";
import EditingWorkoutProgram from "../components/workoutProgram/EditingWorkoutProgram";
export const ProgramContext = createContext();
const CreateWorkoutProgramScreen = () => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();
  const { user } = useAuth();
  const { db } = useFirebase();
  const workoutsFlatListRef = useRef();
  const maxWorkoutsPerProgram = 7;
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("CreateWorkoutProgram");
    }, [])
  );
  return (
    <View style={safeAreaStyle()}>
      <Header
        title={languageService[user.language].buildProgram}
        goBackOption={true}
      />
      <EditingWorkoutProgram />
    </View>
  );
};

export default CreateWorkoutProgramScreen;
