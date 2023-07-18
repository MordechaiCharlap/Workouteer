import { View, FlatList, KeyboardAvoidingView } from "react-native";
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
  const [highlightErrors, setHighlightErrors] = useState(true);
  const [maximizedWorkout, setMaximizedWorkout] = useState(0);
  const newWorkout = () => {
    const programDataClone = { ...programData };
    programDataClone.workouts.push({
      name: "",
      restSeconds: 0,
      exercises: [{ name: "", sets: 0, reps: 0 }],
    });
    setProgramData(programDataClone);
    setMaximizedWorkout(programDataClone.workouts.length - 1);
  };

  const handleProgramNameChange = (text) => {
    const dataClone = { ...programData };
    dataClone.name = text;
    setProgramData(dataClone);
  };
  const handleCreateWorkoutProgram = () => {
    if (
      programData.name == "" ||
      programData.workouts.findIndex(
        (workout) =>
          workout.restSeconds == 0 ||
          workout.name == "" ||
          workout.exercises.findIndex(
            (exercise) =>
              exercise.name == "" || exercise.reps == 0 || exercise.sets == 0
          ) != -1
      ) != -1
    ) {
      setHighlightErrors(true);
    } else {
      console.log("Lets create!");
    }
  };
  const isWorkoutMissingData = (workout) => {
    if (
      workout.restSeconds == 0 ||
      workout.name == "" ||
      workout.exercises.findIndex(
        (exercise) =>
          exercise.name == "" || exercise.reps == 0 || exercise.sets == 0
      ) != -1
    )
      return true;
    return false;
  };
  return (
    <ProgramContext.Provider
      value={{
        programData,
        setProgramData,
        maximizedWorkout,
        setMaximizedWorkout,
        highlightErrors,
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
          <View style={{ height: 50, justifyContent: "center" }}>
            <FlatList
              keyboardShouldPersistTaps={"always"}
              data={programData.workouts}
              horizontal={true}
              keyExtractor={(_, index) => index}
              contentContainerStyle={{
                alignItems: "center",
                columnGap: 10,
                width: "100%",
                justifyContent:
                  programData.workouts.length == 6
                    ? "space-between"
                    : "flex-start",
              }}
              renderItem={({ item, index }) => (
                <CustomButton
                  onPress={() => setMaximizedWorkout(index)}
                  style={{
                    backgroundColor:
                      index == maximizedWorkout
                        ? appStyle.color_on_surface_variant
                        : appStyle.color_surface_variant,
                    minWidth: 50,
                    borderWidth: 2,
                    borderColor:
                      highlightErrors &&
                      isWorkoutMissingData(programData.workouts[index])
                        ? appStyle.color_error
                        : index == maximizedWorkout
                        ? appStyle.color_on_surface_variant
                        : appStyle.color_surface_variant,
                  }}
                >
                  <CustomText
                    style={{
                      color:
                        index == maximizedWorkout
                          ? appStyle.color_surface_variant
                          : appStyle.color_on_surface_variant,
                    }}
                  >
                    {item.name != "" ? item.name : index + 1}
                  </CustomText>
                </CustomButton>
              )}
            />
          </View>
          <CustomButton
            disabled={programData.workouts.length == 6}
            className="flex-row"
            onPress={newWorkout}
            style={{
              height: 40,
              borderColor: appStyle.color_outline,
              borderWidth: 0.5,
              columnGap: 3,
              padding: 10,
              borderRadius: 8,
              backgroundColor:
                programData.workouts.length == 6
                  ? appStyle.color_surface_variant
                  : appStyle.color_primary,
            }}
          >
            {programData.workouts.length < 6 && (
              <FontAwesomeIcon
                color={appStyle.color_on_primary}
                icon={faPlusCircle}
                size={15}
              />
            )}
            <CustomText
              style={{
                color:
                  programData.workouts.length == 6
                    ? appStyle.color_on_surface_variant
                    : appStyle.color_on_primary,
              }}
            >
              {programData.workouts.length == 6
                ? "Can't have more than 6 workouts"
                : "New Workout"}
            </CustomText>
          </CustomButton>
          {maximizedWorkout != null &&
            programData.workouts.length >= maximizedWorkout - 1 && (
              <EditingWorkout workoutIndex={maximizedWorkout} />
            )}
          <View className="flex-1" />

          <CustomButton
            onPress={handleCreateWorkoutProgram}
            round
            style={{
              alignSelf: "center",
              flexDirection: "row",
              height: 40,
              borderColor: appStyle.color_outline,
              borderWidth: 0.5,
              columnGap: 3,
              padding: 10,
              borderRadius: 8,
              backgroundColor: appStyle.color_on_background,
              marginBottom: 20,
            }}
          >
            <CustomText
              style={{
                color: appStyle.color_background,
                fontWeight: 600,
              }}
            >
              Create workout program
            </CustomText>
          </CustomButton>
        </View>
      </View>
    </ProgramContext.Provider>
  );
};

export default CreateWorkoutProgramScreen;
