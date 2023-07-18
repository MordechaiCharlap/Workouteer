import { View, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import CustomTextInput from "../basic/CustomTextInput";
import CustomText from "../basic/CustomText";
import * as appStyle from "../../utils/appStyleSheet";
import { ProgramContext } from "../../screens/CreateWorkoutProgramScreen";
const EditingExercise = ({
  exerciseIndex,
  workoutIndex,
  highlightExercisesErrors,
  tryRemoveHighlightErrors,
}) => {
  const { programData, setProgramData, maximizedWorkout, highlightErrors } =
    useContext(ProgramContext);
  const [name, setName] = useState(
    programData.workouts[workoutIndex].exercises[exerciseIndex].name
  );
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [sets, setSets] = useState(
    programData.workouts[workoutIndex].exercises[exerciseIndex].sets
  );
  const [isSetsFocused, setIsSetsFocused] = useState(false);
  const [reps, setReps] = useState(
    programData.workouts[workoutIndex].exercises[exerciseIndex].reps
  );
  const [isRepsFocused, setIsRepsFocused] = useState(false);

  useEffect(() => {
    const programDataClone = { ...programData };
    programDataClone.workouts[workoutIndex].exercises[exerciseIndex] = {
      name: name,
      sets: sets,
      reps: reps,
    };
    setProgramData(programDataClone);
    if (highlightExercisesErrors) tryRemoveHighlightErrors();
  }, [name, sets, reps]);
  useEffect(() => {
    const exersiceData =
      programData.workouts[workoutIndex].exercises[exerciseIndex];
    setName(exersiceData.name);
    setSets(exersiceData.sets);
    setReps(exersiceData.reps);
  }, [maximizedWorkout]);
  const handleSetsChange = (text) => {
    if (!isSetsFocused) return;
    var validRegex = /^[0-9]{0,2}$/;
    if (text.match(validRegex)) {
      setSets(text == "" ? text : parseInt(text));
    } else {
      setSets(0);
    }
  };
  const handleRepsChange = (text) => {
    if (!isRepsFocused) return;
    var validRegex = /^[0-9]{0,2}$/;
    if (text.match(validRegex)) {
      setReps(text == "" ? text : parseInt(text));
    } else {
      setReps(0);
    }
  };
  return (
    <View className="flex-row items-center w-full" style={{ columnGap: 8 }}>
      <CustomTextInput
        error={
          (highlightExercisesErrors || highlightErrors) && name == "" && true
        }
        value={name}
        className="text-center"
        style={{
          flexGrow: 3,
          backgroundColor: appStyle.color_surface_variant,
        }}
        onFocus={() => setIsNameFocused(true)}
        onBlur={() => setIsNameFocused(false)}
        onChangeText={(text) => {
          if (isNameFocused) setName(text);
        }}
      />
      <CustomTextInput
        error={
          (highlightExercisesErrors || highlightErrors) && sets == 0 && true
        }
        style={{ flexGrow: 1, backgroundColor: appStyle.color_surface_variant }}
        className="text-center"
        value={String(sets)}
        keyboardType="numeric"
        maxLength={2}
        onFocus={() => setIsSetsFocused(true)}
        onBlur={() => setIsSetsFocused(false)}
        onChangeText={(text) => handleSetsChange(text)}
      />
      <CustomTextInput
        error={
          (highlightExercisesErrors || highlightErrors) && reps == 0 && true
        }
        style={{ flexGrow: 1, backgroundColor: appStyle.color_surface_variant }}
        className="text-center"
        value={String(reps)}
        keyboardType="numeric"
        maxLength={2}
        onFocus={() => setIsRepsFocused(true)}
        onBlur={() => setIsRepsFocused(false)}
        onChangeText={(text) => handleRepsChange(text)}
      />
    </View>
  );
};

export default EditingExercise;
