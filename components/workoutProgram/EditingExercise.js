import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import CustomTextInput from "../basic/CustomTextInput";
import CustomText from "../basic/CustomText";
import * as appStyle from "../../utils/appStyleSheet";
const EditingExercise = ({ exercise, updateExercise }) => {
  const [name, setName] = useState(exercise.name);
  const [sets, setSets] = useState(exercise.sets);
  const [setsFocused, setSetsFocused] = useState(false);
  const [reps, setReps] = useState(exercise.reps);
  const [repsFocused, setRepsFocused] = useState(false);
  useEffect(() => {
    if (name != "" && sets != 0 && reps != 0) {
      updateExercise({ name: name, sets: sets, reps: reps });
    } else {
      console.log("not updating yet");
    }
  }, [name, sets, reps]);
  const handleSetsChange = (text) => {
    // console.log("test4");
    // if (!setsFocused) {
    //   console.log("test3");
    //   return;
    // }

    var validRegex = /^[0-9]{0,2}$/;
    if (text.match(validRegex)) {
      console.log(text);
      setSets(text);
    } else {
      setSets(0);
    }
  };
  const handleRepsChange = (text) => {
    // if (!repsFocused) return;
    var validRegex = /^[0-9]{0,2}$/;
    if (text.match(validRegex)) {
      console.log(text);
      setReps(text);
    } else {
      setReps(0);
    }
  };
  return (
    <View className="flex-row items-center w-full" style={{ columnGap: 8 }}>
      <CustomTextInput
        placeholder={name}
        className="text-center"
        style={{ flexGrow: 3, backgroundColor: appStyle.color_surface_variant }}
        onChangeText={setName}
      />
      <CustomTextInput
        style={{ flexGrow: 1, backgroundColor: appStyle.color_surface_variant }}
        className="text-center"
        value={String(sets)}
        keyboardType="numeric"
        maxLength={2}
        onChangeText={(text) => handleSetsChange(text)}
        onFocus={() => setSetsFocused(true)}
        onBlur={() => setSetsFocused(false)}
      />
      <CustomTextInput
        style={{ flexGrow: 1, backgroundColor: appStyle.color_surface_variant }}
        className="text-center"
        value={String(reps)}
        keyboardType="numeric"
        maxLength={2}
        onChangeText={(text) => handleRepsChange(text)}
        onFocus={() => setRepsFocused(true)}
        onBlur={() => setRepsFocused(false)}
      />
    </View>
  );
};

export default EditingExercise;
