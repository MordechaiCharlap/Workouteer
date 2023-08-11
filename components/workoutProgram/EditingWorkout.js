import { View, FlatList, Modal } from "react-native";
import React, { useContext, useState } from "react";
import {
  color_error,
  color_on_primary_container,
  color_outline,
  color_primary,
  color_primary_container,
} from "../../utils/appStyleSheet";
import CustomText from "../basic/CustomText";
import CustomButton from "../basic/CustomButton";
import RestTimePicker from "./RestTimePicker";
import EditingWorkoutHeader from "./EditingWorkoutHeader";
import { ProgramContext } from "./EditingWorkoutProgram";
import EditingExercise from "./EditingExercise";
import CreatedExercise from "./CreatedExercise";
import languageService from "../../services/languageService";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import useResponsiveness from "../../hooks/useResponsiveness";
import appComponentsDefaultStyles from "../../utils/appComponentsDefaultStyles";
import { convertHexToRgba } from "../../utils/stylingFunctions";

const EditingWorkout = ({ workoutIndex }) => {
  const { user } = useAuth();
  const { programData, setProgramData, highlightErrors } =
    useContext(ProgramContext);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState();
  const [editingExercise, setEditingExercise] = useState();
  const { windowHeight } = useResponsiveness();
  const addNewExercise = (newExercise) => {
    const programDataClone = JSON.parse(JSON.stringify(programData));
    programDataClone.workouts[workoutIndex].exercises.push(newExercise);
    setProgramData(programDataClone);
    setEditingExercise();
  };
  const updateExercise = (updatedExercise) => {
    const programDataClone = JSON.parse(JSON.stringify(programData));
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
    const programDataClone = JSON.parse(JSON.stringify(programData));
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
        flex: 1,
        minHeight: windowHeight / 2,
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

      <View
        className={`flex-row${
          user.language == "hebrew" && "-reverse"
        } items-center`}
        style={{ columnGap: 5 }}
      >
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
            borderColor:
              highlightErrors &&
              programData.workouts[workoutIndex].exercises.length == 0
                ? color_error
                : color_outline,
            borderRadius: 8,
            padding: 5,
          }}
          className="flex-1"
        >
          <View
            className={`flex-row${
              user.language == "hebrew" && "-reverse"
            } items-center w-full`}
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
          <FlatList
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
            data={programData.workouts[workoutIndex].exercises}
            keyExtractor={(_, index) => index}
            contentContainerStyle={{ rowGap: 5 }}
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
          <View className="items-center absolute bottom-0  right-0 left-0">
            <CustomButton
              className="px-5 m-3"
              round
              onPress={() => setEditingExercise(true)}
              style={[
                {
                  borderWidth: 1,
                  borderColor:
                    highlightErrors &&
                    programData.workouts[workoutIndex].exercises.length == 0
                      ? color_error
                      : convertHexToRgba(containerColor, 0.5),
                  backgroundColor: color_primary,
                },
                appComponentsDefaultStyles.shadow,
              ]}
            >
              <FontAwesomeIcon icon={faPlus} color={containerColor} size={20} />
            </CustomButton>
          </View>
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
