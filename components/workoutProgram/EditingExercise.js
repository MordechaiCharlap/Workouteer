import { View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomTextInput from "../basic/CustomTextInput";
import * as appStyle from "../../utils/appStyleSheet";
import { convertHexToRgba } from "../../utils/stylingFunctions";
import CustomButton from "../basic/CustomButton";
import CustomText from "../basic/CustomText";
import languageService from "../../services/languageService";
import useAuth from "../../hooks/useAuth";
const EditingExercise = ({
  addNewExercise,
  updateExercise,
  exercise,
  editingExerciseIndex,
  deleteEditingExercise,
  cancelEditingExercise,
}) => {
  const { user } = useAuth();
  const [name, setName] = useState(
    editingExerciseIndex != null ? exercise.name : ""
  );
  const [sets, setSets] = useState(
    editingExerciseIndex != null ? String(exercise.sets) : null
  );
  const [reps, setReps] = useState(
    editingExerciseIndex != null ? String(exercise.reps) : null
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
      setSets(text);
    } else {
      setSets(sets);
    }
  };
  const handleRepsChange = (text) => {
    if (!repsFocus) return;
    var validRegex = /^[0-9]{0,2}$/;
    if (text.match(validRegex)) {
      setReps(text);
    } else {
      setReps(reps);
    }
  };
  const handleAddExercise = () => {
    if (name == "" || !sets || !reps) {
      setHighlightExercisesErrors(true);
      return;
    }
    addNewExercise({ name: name, sets: sets, reps: reps });
  };
  const handleUpdateExercise = () => {
    if (name == "" || !sets || !reps) {
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
            className=" text-lg tracking-widest"
            style={{
              padding: 7,
              borderRadius: 999,
              fontWeight: 500,
              borderRadius: 4,
              backgroundColor: appStyle.color_on_primary_container,
              color: appStyle.color_primary_container,
            }}
          >
            {editingExerciseIndex != null
              ? languageService[user.language].editExercise
              : languageService[user.language].newExercise}
          </CustomText>
        </View>

        <View
          className={`flex-row${
            user.language == "hebrew" ? "-reverse" : ""
          } items-center w-full`}
          style={{ columnGap: 8 }}
        >
          <CustomText
            className="text-center font-semibold"
            style={{ flexGrow: 3, color: appStyle.color_on_primary_container }}
          >
            {languageService[user.language].name.charAt(0).toUpperCase() +
              languageService[user.language].name.slice(1)}
          </CustomText>
          <CustomText
            className="text-center font-semibold"
            style={{ flexGrow: 1, color: appStyle.color_on_primary_container }}
          >
            {languageService[user.language].sets}
          </CustomText>
          <CustomText
            className="text-center font-semibold"
            style={{ flexGrow: 1, color: appStyle.color_on_primary_container }}
          >
            {languageService[user.language].reps}
          </CustomText>
        </View>
        <View
          className={`flex-row${
            user.language == "hebrew" ? "-reverse" : ""
          } items-center w-full`}
          style={{ columnGap: 8 }}
        >
          <CustomTextInput
            maxLength={20}
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
            error={highlightExercisesErrors && !sets}
            style={{
              flexGrow: 1,
              backgroundColor: appStyle.color_surface_variant,
            }}
            className="text-center"
            value={sets}
            keyboardType="numeric"
            maxLength={2}
            onFocus={() => setSetsFocus(true)}
            onBlur={() => setSetsFocus(false)}
            onChangeText={(text) => {
              handleSetsChange(text);
            }}
          />
          <CustomTextInput
            error={highlightExercisesErrors && !reps}
            style={{
              flexGrow: 1,
              backgroundColor: appStyle.color_surface_variant,
            }}
            className="text-center"
            value={reps}
            keyboardType="numeric"
            maxLength={2}
            onFocus={() => setRepsFocus(true)}
            onBlur={() => setRepsFocus(false)}
            onChangeText={(text) => handleRepsChange(text)}
          />
        </View>
        <View
          className={`flex-row${
            user.language == "hebrew" ? "-reverse" : ""
          } items-center`}
          style={{ columnGap: 5 }}
        >
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
            <CustomText
              style={{
                color: appStyle.color_on_primary_container,
                fontWeight: 500,
              }}
            >
              {editingExerciseIndex != null
                ? languageService[user.language].update
                : languageService[user.language].add}
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
              <CustomText style={{ fontWeight: 500 }}>
                {languageService[user.language].remove}
              </CustomText>
            </CustomButton>
          )}
        </View>
        <CustomButton
          onPress={cancelEditingExercise}
          style={{
            borderWidth: 1,
            borderColor: appStyle.color_outline,
          }}
        >
          <CustomText style={{ fontWeight: 500 }}>
            {languageService[user.language].cancel}
          </CustomText>
        </CustomButton>
      </View>
    </View>
  );
};

export default EditingExercise;
