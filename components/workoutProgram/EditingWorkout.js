import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import {
  color_outline,
  color_primary_container,
  color_surface,
  color_surface_variant,
} from "../../utils/appStyleSheet";
import CustomTextInput from "../basic/CustomTextInput";
import CustomText from "../basic/CustomText";
import CustomButton from "../basic/CustomButton";
import EditingExercise from "./EditingExercise";

const EditingWorkout = ({ workout, workoutIndex }) => {
  const [workoutName, setWorkoutName] = useState(workout.name);
  const [exercises, setExercises] = useState(workout.exercises);
  const addExercise = () => {
    const exercisesClone = exercises.slice();
    exercisesClone.push({ name: "", sets: 0, reps: 0 });
    setExercises(exercisesClone);
  };
  return (
    <View
      style={{
        backgroundColor: color_surface_variant,
        padding: 10,
        borderRadius: 8,
        rowGap: 15,
      }}
    >
      <View className="flex-row items-center" style={{ columnGap: 10 }}>
        <CustomText>Workout name:</CustomText>
        <CustomTextInput
          value={workoutName}
          onChangeText={(text) => setWorkoutName(text)}
        />
      </View>
      <View>
        <CustomText style={{ marginBottom: 5, fontWeight: 500 }}>
          Exercises:
        </CustomText>
        <View
          style={{
            backgroundColor: color_surface,
            borderWidth: 1,
            borderColor: color_outline,
            borderRadius: 8,
            padding: 5,
          }}
        >
          <FlatList
            data={exercises}
            keyExtractor={(_, index) => index}
            style={{ rowGap: 5 }}
            ListHeaderComponent={
              <View className="flex-row w-full" style={{ columnGap: 8 }}>
                <CustomText className="text-center" style={{ flexGrow: 3 }}>
                  Name
                </CustomText>
                <CustomText className="text-center" style={{ flexGrow: 1 }}>
                  Sets
                </CustomText>
                <CustomText className="text-center" style={{ flexGrow: 1 }}>
                  Reps
                </CustomText>
              </View>
            }
            renderItem={({ item }) => <EditingExercise exercise={item} />}
          />
          <CustomButton
            onPress={addExercise}
            style={{
              marginTop: 10,
              alignSelf: "flex-start",
              backgroundColor: color_primary_container,
            }}
          >
            <CustomText>Add exercise</CustomText>
          </CustomButton>
        </View>
      </View>
    </View>
  );
};

export default EditingWorkout;
