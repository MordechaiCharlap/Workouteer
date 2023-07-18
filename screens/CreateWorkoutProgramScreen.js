import {
  View,
  Text,
  FlatList,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import CustomText from "../components/basic/CustomText";
import CustomTextInput from "../components/basic/CustomTextInput";
import * as appStyle from "../utils/appStyleSheet";
import Header from "../components/Header";
import CustomButton from "../components/basic/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import EditingWorkout from "../components/workoutProgram/EditingWorkout";
export const ProgramContext = createContext();
const CreateWorkoutProgramScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("CreateWorkoutProgram");
    }, [])
  );
  const [programData, setProgramData] = useState({
    name: "",
    workouts: [
      { name: "", restSeconds: 0, exercises: [{ name: "", sets: 0, reps: 0 }] },
    ],
  });
  const [maximizedWorkout, setMaximizedWorkout] = useState(0);
  const newWorkout = () => {
    const workoutsClone = workouts.slice();
    workoutsClone.push({
      name: "",
      restSeconds: 0,
      exercises: [{ name: "", sets: 0, reps: 0 }],
    });
    setWorkouts(workoutsClone);
  };

  const handleProgramNameChange = (text) => {
    const dataClone = { ...programData };
    dataClone.name = text;
    setProgramData(dataClone);
  };
  return (
    <ProgramContext.Provider
      value={{
        programData,
        setProgramData,
        maximizedWorkout,
        setMaximizedWorkout,
      }}
    >
      <View style={safeAreaStyle()}>
        <Header title={"Create new program"} goBackOption={true} />
        <View style={{ paddingHorizontal: 16, rowGap: 10, flex: 1 }}>
          <View className="flex-row items-center" style={{ columnGap: 5 }}>
            <CustomText>Program name:</CustomText>
            <CustomTextInput
              value={programData.name}
              onChangeText={handleProgramNameChange}
              style={{ backgroundColor: appStyle.color_surface_variant }}
            />
          </View>
          <View className="flex-row">
            <CustomText>Workouts:</CustomText>
          </View>
          <FlatList
            keyboardShouldPersistTaps={"always"}
            data={programData.workouts}
            keyExtractor={(_, index) => index}
            scrollEnabled={true}
            contentContainerStyle={{ rowGap: 10 }}
            ListHeaderComponent={
              <CustomButton
                className="flex-row"
                onPress={newWorkout}
                style={{
                  height: 40,
                  borderColor: appStyle.color_outline,
                  borderWidth: 0.5,
                  columnGap: 3,
                  padding: 10,
                  borderRadius: 8,
                  backgroundColor: appStyle.color_primary,
                }}
              >
                <FontAwesomeIcon
                  color={appStyle.color_on_primary}
                  icon={faPlusCircle}
                  size={15}
                />
                <CustomText style={{ color: appStyle.color_on_primary }}>
                  New Workout
                </CustomText>
              </CustomButton>
            }
            renderItem={({ item, index }) => (
              <EditingWorkout workoutIndex={index} />
            )}
          />

          <CustomButton
            round
            style={{
              flexDirection: "row",
              height: 40,
              borderColor: appStyle.color_outline,
              borderWidth: 0.5,
              columnGap: 3,
              padding: 10,
              borderRadius: 8,
              backgroundColor: appStyle.color_on_background,
            }}
          >
            <CustomText
              style={{
                color: appStyle.color_background,
                fontWeight: 600,
              }}
            >
              Create program
            </CustomText>
          </CustomButton>
        </View>
      </View>
    </ProgramContext.Provider>
  );
};

export default CreateWorkoutProgramScreen;
