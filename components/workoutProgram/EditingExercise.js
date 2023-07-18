import { View, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import CustomTextInput from "../basic/CustomTextInput";
import CustomText from "../basic/CustomText";
import * as appStyle from "../../utils/appStyleSheet";
import { ProgramContext } from "../../screens/CreateWorkoutProgramScreen";
const EditingExercise = ({ exerciseIndex, workoutIndex, highlightErrors }) => {
  const { programData, setProgramData } = useContext(ProgramContext);
  const [name, setName] = useState(
    programData.workouts[workoutIndex].exercises[exerciseIndex].name
  );
  const [sets, setSets] = useState(
    programData.workouts[workoutIndex].exercises[exerciseIndex].sets
  );
  const [reps, setReps] = useState(
    programData.workouts[workoutIndex].exercises[exerciseIndex].reps
  );

  useEffect(() => {
    const programDataClone = { ...programData };
    programDataClone.workouts[workoutIndex].exercises[exerciseIndex] = {
      name: name,
      sets: sets,
      reps: reps,
    };
    setProgramData(programDataClone);
  }, [name, sets, reps]);
  const handleSetsChange = (text) => {
    var validRegex = /^[0-9]{0,2}$/;
    if (text.match(validRegex)) {
      setSets(text == "" ? text : parseInt(text));
    } else {
      setSets(0);
    }
  };
  const handleRepsChange = (text) => {
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
        error={highlightErrors && name == "" && true}
        value={name}
        className="text-center"
        style={{
          flexGrow: 3,
          backgroundColor: appStyle.color_surface_variant,
        }}
        onChangeText={setName}
      />
      <CustomTextInput
        error={highlightErrors && sets == 0 && true}
        style={{ flexGrow: 1, backgroundColor: appStyle.color_surface_variant }}
        className="text-center"
        value={String(sets)}
        keyboardType="numeric"
        maxLength={2}
        onChangeText={(text) => handleSetsChange(text)}
      />
      <CustomTextInput
        error={highlightErrors && reps == 0 && true}
        style={{ flexGrow: 1, backgroundColor: appStyle.color_surface_variant }}
        className="text-center"
        value={String(reps)}
        keyboardType="numeric"
        maxLength={2}
        onChangeText={(text) => handleRepsChange(text)}
      />
    </View>
  );
};

export default EditingExercise;
