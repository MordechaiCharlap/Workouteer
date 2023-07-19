import { View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomTextInput from "../basic/CustomTextInput";
import * as appStyle from "../../utils/appStyleSheet";
import { convertHexToRgba } from "../../utils/stylingFunctions";
import CustomButton from "../basic/CustomButton";
import CustomText from "../basic/CustomText";
const EditingExercise = ({
  addNewExercise,
  updateExercise,
  exercise,
  editingExerciseIndex,
  deleteEditingExercise,
  cancelEditingExercise,
}) => {
  const [name, setName] = useState(
    editingExerciseIndex != null ? exercise.name : ""
  );
  const [sets, setSets] = useState(
    editingExerciseIndex != null ? exercise.sets : 0
  );
  const [reps, setReps] = useState(
    editingExerciseIndex != null ? exercise.reps : 0
  );
  const [nameFocus, setNameFocus] = useState(false);
  const [repsFocus, setRepsFocus] = useState(false);
  const [setsFocus, setSetsFocus] = useState(false);
  const [highlightExercisesErrors, setHighlightExercisesErrors] =
    useState(false);
  const handleSetsChange = (text) => {
    if (!setsFocus) return;
    var validRegex = /^[0-9]{0,2}$/;
    if (text.match(validRegex)) {
      setSets(text == "" ? text : parseInt(text));
    } else {
      setSets(0);
    }
  };
  const handleRepsChange = (text) => {
    if (!repsFocus) return;
    var validRegex = /^[0-9]{0,2}$/;
    if (text.match(validRegex)) {
      setReps(text == "" ? text : parseInt(text));
    } else {
      setReps(0);
    }
  };
  const handleAddExercise = () => {
    if (name == "" || sets == 0 || reps == 0) {
      setHighlightExercisesErrors(true);
      return;
    }
    addNewExercise({ name: name, sets: sets, reps: reps });
  };
  const handleUpdateExercise = () => {
    if (name == "" || sets == 0 || reps == 0) {
      setHighlightExercisesErrors(true);
      return;
    }
    updateExercise({ name: name, sets: sets, reps: reps });
  };
  return (
    <View
      className="w-full h-full justify-center items-center"
      style={{
        paddingHorizontal: 8,
        backgroundColor: convertHexToRgba(appStyle.color_on_background, 0.6),
      }}
    >
      <View
        style={{
          backgroundColor: appStyle.color_surface,
          padding: 12,
          borderRadius: 12,
          rowGap: 10,
        }}
      >
        <View className="items-center">
          <CustomText
            style={{
              padding: 7,
              borderRadius: 4,
              backgroundColor: appStyle.color_on_background,
              color: appStyle.color_background,
            }}
          >
            {editingExerciseIndex != null ? "Edit exercise" : "New exercise"}
          </CustomText>
        </View>

        <View className="flex-row w-full" style={{ columnGap: 8 }}>
          <CustomText
            className="text-center"
            style={{ flexGrow: 3, color: appStyle.color_on_primary_container }}
          >
            Name
          </CustomText>
          <CustomText
            className="text-center"
            style={{ flexGrow: 1, color: appStyle.color_on_primary_container }}
          >
            Sets
          </CustomText>
          <CustomText
            className="text-center"
            style={{ flexGrow: 1, color: appStyle.color_on_primary_container }}
          >
            Reps
          </CustomText>
        </View>
        <View className="flex-row items-center w-full" style={{ columnGap: 8 }}>
          <CustomTextInput
            error={highlightExercisesErrors && name == "" && true}
            value={name}
            className="text-center"
            style={{
              flexGrow: 3,
              backgroundColor: appStyle.color_surface_variant,
            }}
            onFocus={() => setNameFocus(true)}
            onBlur={() => setNameFocus(false)}
            onChangeText={(text) => {
              if (nameFocus) setName(text);
            }}
          />
          <CustomTextInput
            error={highlightExercisesErrors && sets == 0 && true}
            style={{
              flexGrow: 1,
              backgroundColor: appStyle.color_surface_variant,
            }}
            className="text-center"
            value={String(sets)}
            keyboardType="numeric"
            maxLength={2}
            onFocus={() => setSetsFocus(true)}
            onBlur={() => setSetsFocus(false)}
            onChangeText={(text) => {
              handleSetsChange(text);
            }}
          />
          <CustomTextInput
            error={highlightExercisesErrors && reps == 0 && true}
            style={{
              flexGrow: 1,
              backgroundColor: appStyle.color_surface_variant,
            }}
            className="text-center"
            value={String(reps)}
            keyboardType="numeric"
            maxLength={2}
            onFocus={() => setRepsFocus(true)}
            onBlur={() => setRepsFocus(false)}
            onChangeText={(text) => handleRepsChange(text)}
          />
        </View>
        <View className="flex-row" style={{ columnGap: 5 }}>
          <CustomButton
            onPress={
              editingExerciseIndex != null
                ? handleUpdateExercise
                : handleAddExercise
            }
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: appStyle.color_outline,
              backgroundColor: appStyle.color_primary_container,
            }}
          >
            <CustomText style={{ color: appStyle.color_primary }}>
              {editingExerciseIndex != null ? "Update" : "Add"}
            </CustomText>
          </CustomButton>
          {editingExerciseIndex != null && (
            <CustomButton
              onPress={deleteEditingExercise}
              style={{
                flex: 1,
                backgroundColor: appStyle.color_on_primary,
                borderWidth: 1,
                borderColor: appStyle.color_outline,
              }}
            >
              <CustomText>Delete</CustomText>
            </CustomButton>
          )}
        </View>
        <CustomButton
          onPress={cancelEditingExercise}
          style={{ borderWidth: 1, borderColor: appStyle.color_outline }}
        >
          <CustomText>Cancel</CustomText>
        </CustomButton>
      </View>
    </View>
  );
};

export default EditingExercise;
