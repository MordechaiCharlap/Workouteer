import React from "react";
import CustomText from "../basic/CustomText";
import {
  color_on_primary_container,
  color_outline,
  color_primary_container,
} from "../../utils/appStyleSheet";
import CustomButton from "../basic/CustomButton";
import useAuth from "../../hooks/useAuth";

const CreatedExercise = ({ exercise, editExercise }) => {
  const { user } = useAuth();
  return (
    <CustomButton
      onPress={editExercise}
      className={`flex-row${
        user.language == "hebrew" && "-reverse"
      } items-center w-full`}
      style={{
        columnGap: 8,
        backgroundColor: color_primary_container,
        borderColor: color_outline,
        borderWidth: 0.5,
      }}
    >
      <CustomText
        className={`text-${user.language == "hebrew" ? "right" : "left"}`}
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
