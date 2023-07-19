import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  color_outline,
  color_primary_container,
  color_surface,
  color_surface_variant,
} from "../../utils/appStyleSheet";
import CustomText from "../basic/CustomText";
import CustomButton from "../basic/CustomButton";
import RestTimePicker from "./RestTimePicker";
import EditingWorkoutHeader from "./EditingWorkoutHeader";
import { ProgramContext } from "../../screens/CreateWorkoutProgramScreen";
import EditingExercise from "./EditingExercise";
import CreatedExercise from "./CreatedExercise";

const EditingWorkout = ({ workoutIndex }) => {
  const { programData, setProgramData, maximizedWorkout } =
    useContext(ProgramContext);
  const [highlightExercisesErrors, setHighlightExercisesErrors] =
    useState(false);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState();
  const [editingExercise, setEditingExercise] = useState();
  const addNewExercise = (newExercise) => {
    const programDataClone = { ...programData };
    programDataClone.workouts[workoutIndex].exercises.push(newExercise);
    setProgramData(programDataClone);
    setEditingExercise();
  };
  const updateExercise = (updatedExercise) => {
    const programDataClone = { ...programData };
    programDataClone.workouts[workoutIndex].exercises[editingExerciseIndex] =
      updatedExercise;
    setProgramData(programDataClone);
    setEditingExercise();
    setEditingExerciseIndex();
  };
  const cancelEditingExercise = () => {
    setEditingExercise();
    setEditingExerciseIndex();
  };
  const deleteEditingExercise = (index) => {
    const programDataClone = { ...programData };
    programDataClone.workouts[workoutIndex].exercises.splice(index, 1);
    setProgramData(programDataClone);
    setEditingExercise();
    setEditingExerciseIndex();
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
        height: "100%",
      }}
    >
      <EditingWorkoutHeader workoutIndex={workoutIndex} />
      <View className="flex-row items-center" style={{ columnGap: 5 }}>
        <CustomText>Rest time between sets:</CustomText>
        <RestTimePicker workoutIndex={workoutIndex} />
      </View>

      <View className="flex-1">
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
          className="flex-1"
        >
          <FlatList
            className="flex-1"
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
            data={programData.workouts[workoutIndex].exercises}
            keyExtractor={(_, index) => index}
            contentContainerStyle={{ rowGap: 5 }}
            ListHeaderComponent={
              <View
                className="flex-row w-full"
                style={{ columnGap: 8, padding: 5 }}
              >
                <CustomText style={{ width: 1, flexGrow: 3 }}>Name</CustomText>
                <CustomText
                  className="text-center"
                  style={{ width: 1, flexGrow: 1 }}
                >
                  Sets
                </CustomText>
                <CustomText
                  className="text-center"
                  style={{ width: 1, flexGrow: 1 }}
                >
                  Reps
                </CustomText>
              </View>
            }
            renderItem={({ item, index }) => (
              <CreatedExercise
                exercise={item}
                editExercise={() => {
                  setEditingExercise(item);
                  setEditingExerciseIndex(index);
                }}
              />
            )}
          />
          <CustomButton
            onPress={() => setEditingExercise(true)}
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
      {editingExercise != null && (
        <Modal transparent={true}>
          <EditingExercise
            addNewExercise={addNewExercise}
            cancelEditingExercise={cancelEditingExercise}
            deleteEditingExercise={deleteEditingExercise}
            updateExercise={updateExercise}
            editingExerciseIndex={editingExerciseIndex}
            exercise={editingExercise}
          />
        </Modal>
      )}
    </View>
  );
};

export default EditingWorkout;
