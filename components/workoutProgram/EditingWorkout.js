import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  color_background,
  color_error,
  color_on_background,
  color_outline,
  color_primary_container,
  color_surface,
  color_surface_variant,
} from "../../utils/appStyleSheet";
import CustomText from "../basic/CustomText";
import CustomButton from "../basic/CustomButton";
import EditingExercise from "./EditingExercise";
import RestTimePicker from "./RestTimePicker";
import EditingWorkoutHeader from "./EditingWorkoutHeader";
import { ProgramContext } from "../../screens/CreateWorkoutProgramScreen";

const EditingWorkout = ({ workoutIndex }) => {
  const { programData, setProgramData, maximizedWorkout } =
    useContext(ProgramContext);
  const [highlightExercisesErrors, setHighlightExercisesErrors] =
    useState(false);
  const addExercise = () => {
    if (
      programData.workouts[workoutIndex].exercises.findIndex(
        (exercise) =>
          exercise.name == "" || exercise.reps == 0 || exercise.sets == 0
      ) != -1
    ) {
      console.log("highlighting errors");
      setHighlightExercisesErrors(true);
      return;
    }
    const programDataClone = { ...programData };
    programDataClone.workouts[workoutIndex].exercises.push({
      name: "",
      sets: 0,
      reps: 0,
    });
    setProgramData(programDataClone);
  };

  const tryRemoveHighlightErrors = () => {
    if (
      highlightExercisesErrors &&
      programData.workouts[workoutIndex].exercises.findIndex(
        (exercise) =>
          exercise.name == "" || exercise.reps == 0 || exercise.sets == 0
      ) == -1
    )
      setHighlightExercisesErrors(false);
  };
  return maximizedWorkout != workoutIndex ? (
    <View
      className="flex-row items-center"
      style={{
        backgroundColor: color_surface_variant,
        padding: 10,
        borderRadius: 8,
        columnGap: 10,
      }}
    >
      <EditingWorkoutHeader workoutIndex={workoutIndex} />
    </View>
  ) : (
    <View
      style={{
        backgroundColor: color_surface_variant,
        padding: 10,
        borderRadius: 8,
        rowGap: 15,
      }}
    >
      <EditingWorkoutHeader workoutIndex={workoutIndex} />
      <View className="flex-row items-center" style={{ columnGap: 5 }}>
        <CustomText>Rest time between sets:</CustomText>
        <RestTimePicker workoutIndex={workoutIndex} />
      </View>

      <View>
        <CustomText style={{ marginBottom: 5, fontWeight: 500 }}>
          Exercises:
        </CustomText>
        <View
          style={{
            backgroundColor: color_surface,
            borderWidth: 1,
            borderColor: color_outline,
            borderRadius: 8,
            padding: 5,
          }}
        >
          <FlatList
            data={programData.workouts[workoutIndex].exercises}
            keyExtractor={(_, index) => index}
            contentContainerStyle={{ rowGap: 5 }}
            ListHeaderComponent={
              <View className="flex-row w-full" style={{ columnGap: 8 }}>
                <CustomText className="text-center" style={{ flexGrow: 3 }}>
                  Name
                </CustomText>
                <CustomText className="text-center" style={{ flexGrow: 1 }}>
                  Sets
                </CustomText>
                <CustomText className="text-center" style={{ flexGrow: 1 }}>
                  Reps
                </CustomText>
              </View>
            }
            renderItem={({ item, index }) => (
              <EditingExercise
                highlightExercisesErrors={highlightExercisesErrors}
                tryRemoveHighlightErrors={tryRemoveHighlightErrors}
                workoutIndex={workoutIndex}
                exerciseIndex={index}
              />
            )}
          />
          <CustomButton
            onPress={addExercise}
            style={{
              marginTop: 10,
              alignSelf: "flex-start",
              backgroundColor: color_primary_container,
            }}
          >
            <CustomText>Add exercise</CustomText>
          </CustomButton>
        </View>
      </View>
    </View>
  );
};

export default EditingWorkout;
