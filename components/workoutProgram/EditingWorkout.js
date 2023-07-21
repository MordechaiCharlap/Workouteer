import { View, FlatList, Modal } from "react-native";
import React, { useContext, useState } from "react";
import {
  color_on_primary,
  color_on_primary_container,
  color_outline,
  color_primary,
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
import languageService from "../../services/languageService";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const EditingWorkout = ({ workoutIndex }) => {
  const { user } = useAuth();
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
  const containerColor = color_primary_container;
  const onContainerColor = color_on_primary_container;
  return (
    <View
      style={{
        backgroundColor: containerColor,
        borderWidth: 0.5,
        borderColor: onContainerColor,
        padding: 10,
        borderRadius: 8,
        rowGap: 15,
        height: "100%",
      }}
    >
      <CustomText className="font-semibold text-center">
        {languageService[user.language].workout + " " + (workoutIndex + 1)}
      </CustomText>
      <EditingWorkoutHeader
        workoutIndex={workoutIndex}
        containerColor={containerColor}
        onContainerColor={onContainerColor}
      />
      <View className="flex-row items-center" style={{ columnGap: 5 }}>
        <CustomText className="text-lg" style={{ color: onContainerColor }}>
          {languageService[user.language].restTimeBetweenSets + ":"}
        </CustomText>
        <RestTimePicker
          workoutIndex={workoutIndex}
          containerColor={containerColor}
          onContainerColor={onContainerColor}
        />
      </View>

      <View className="flex-1">
        <CustomText
          style={{ marginBottom: 5, fontWeight: 500, color: onContainerColor }}
        >
          {languageService[user.language].exercises + ":"}
        </CustomText>
        <View
          style={{
            backgroundColor: onContainerColor,
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
                <CustomText
                  style={{ width: 1, flexGrow: 3, color: containerColor }}
                >
                  {languageService[user.language].name}
                </CustomText>
                <CustomText
                  className="text-center"
                  style={{ width: 1, flexGrow: 1, color: containerColor }}
                >
                  {languageService[user.language].sets}
                </CustomText>
                <CustomText
                  className="text-center"
                  style={{ width: 1, flexGrow: 1, color: containerColor }}
                >
                  {languageService[user.language].reps}
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
            className="absolute bottom-0"
            onPress={() => setEditingExercise(true)}
            style={{
              marginTop: 10,
              alignSelf: "flex-end",
            }}
          >
            <View
              className="rounded-full"
              style={{
                borderWidth: 2,
                borderColor: containerColor,
                backgroundColor: containerColor,
              }}
            >
              <FontAwesomeIcon
                icon={faPlusCircle}
                color={color_primary}
                size={30}
              />
            </View>
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
