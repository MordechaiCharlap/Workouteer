import { View, Text } from "react-native";
import React from "react";
import CustomText from "../basic/CustomText";
import {
  color_on_primary_container,
  color_outline,
  color_primary_container,
  color_surface,
} from "../../utils/appStyleSheet";
import CustomButton from "../basic/CustomButton";

const CreatedExercise = ({ exercise, editExercise }) => {
  return (
    <CustomButton
      onPress={editExercise}
      className="flex-row w-full"
      style={{
        columnGap: 8,
        backgroundColor: color_primary_container,
        borderColor: color_outline,
        borderWidth: 0.5,
      }}
    >
      <CustomText
        style={{ width: 1, flexGrow: 3, color: color_on_primary_container }}
      >
        {exercise.name}
      </CustomText>
      <CustomText
        className="text-center"
        style={{ width: 1, flexGrow: 1, color: color_on_primary_container }}
      >
        {exercise.sets}
      </CustomText>
      <CustomText
        className="text-center"
        style={{ width: 1, flexGrow: 1, color: color_on_primary_container }}
      >
        {exercise.reps}
      </CustomText>
    </CustomButton>
  );
};

export default CreatedExercise;
