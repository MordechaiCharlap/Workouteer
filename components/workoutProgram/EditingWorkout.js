import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import {
  color_surface,
  color_surface_variant,
} from "../../utils/appStyleSheet";
import CustomTextInput from "../basic/CustomTextInput";
import CustomText from "../basic/CustomText";
import CustomButton from "../basic/CustomButton";

const EditingWorkout = () => {
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState([]);
  return (
    <View style={{ backgroundColor: color_surface_variant, padding: 10 }}>
      <View className="flex-row items-center" style={{ columnGap: 5 }}>
        <CustomText>Workout name:</CustomText>
        <CustomTextInput
          value={workoutName}
          onChangeText={(text) => setWorkoutName(text)}
        />
      </View>
      <FlatList
        data={exercises}
        keyExtractor={(_, index) => index}
        renderItem={({ item }) => (
          <View>
            <CustomTextInput placeholder={item.name} />
            <CustomTextInput placeholder={item.sets} />
            <CustomText> sets of </CustomText>
            <CustomTextInput placeholder={item.reps} />
            <CustomText>reps</CustomText>
          </View>
        )}
      />
      <CustomButton
        style={{ alignSelf: "flex-start", backgroundColor: color_surface }}
      >
        <CustomText>Add exercise</CustomText>
      </CustomButton>
    </View>
  );
};

export default EditingWorkout;
