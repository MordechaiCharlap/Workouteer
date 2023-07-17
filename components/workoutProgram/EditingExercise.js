import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import CustomTextInput from "../basic/CustomTextInput";
import CustomText from "../basic/CustomText";
import * as appStyle from "../../utils/appStyleSheet";
const EditingExercise = ({ exercise, updateExercise, highlightErrors }) => {
  const [name, setName] = useState(exercise.name);
  const [sets, setSets] = useState(exercise.sets);
  const [reps, setReps] = useState(exercise.reps);
  useEffect(() => {
    if (name != "" && sets != 0 && reps != 0) {
      updateExercise({ name: name, sets: sets, reps: reps });
    } else {
      console.log("not updating yet");
    }
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
