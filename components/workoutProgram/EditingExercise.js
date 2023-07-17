import { View, Text } from "react-native";
import React, { useState } from "react";
import CustomTextInput from "../basic/CustomTextInput";
import CustomText from "../basic/CustomText";
import * as appStyle from "../../utils/appStyleSheet";
const EditingExercise = ({ exercise }) => {
  const [name, setName] = useState(exercise.name);
  const [sets, setSets] = useState(exercise.sets);
  const [reps, setReps] = useState(exercise.reps);
  return (
    <View className="flex-row items-center w-full" style={{ columnGap: 8 }}>
      <CustomTextInput
        placeholder={name}
        className="text-center"
        style={{ flexGrow: 3, backgroundColor: appStyle.color_surface_variant }}
      />
      <CustomTextInput
        style={{ flexGrow: 1, backgroundColor: appStyle.color_surface_variant }}
        className="text-center"
        placeholder={String(sets)}
        keyboardType="numeric"
      />
      <CustomTextInput
        style={{ flexGrow: 1, backgroundColor: appStyle.color_surface_variant }}
        className="text-center"
        placeholder={String(reps)}
        keyboardType="numeric"
      />
    </View>
  );
};

export default EditingExercise;
