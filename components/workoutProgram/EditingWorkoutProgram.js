import { View, FlatList, TouchableOpacity } from "react-native";
import React, { createContext, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import CustomText from "../basic/CustomText";
import CustomTextInput from "../basic/CustomTextInput";
import * as appStyle from "../../utils/appStyleSheet";
import CustomButton from "../basic/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPlus,
  faPlusCircle,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";
import EditingWorkout from "./EditingWorkout";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import useAuth from "../../hooks/useAuth";
import useFirebase from "../../hooks/useFirebase";
import languageService from "../../services/languageService";
import TopExitButton from "../TopExitButton";
export const ProgramContext = createContext();
const EditingWorkoutProgram = ({ program }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { db } = useFirebase();
  const workoutsFlatListRef = useRef();
  const maxWorkoutsPerProgram = 7;
  const [programData, setProgramData] = useState(
    (program && JSON.parse(JSON.stringify(program))) || {
      name: "",
      workouts: [{ name: "", restSeconds: 0, exercises: [] }],
    }
  );
  const [isProgramNameFocused, setIsProgramNameFocused] = useState(false);
  const [highlightErrors, setHighlightErrors] = useState(false);
  const [maximizedWorkout, setMaximizedWorkout] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const newWorkout = () => {
    const programDataClone = JSON.parse(JSON.stringify(programData));
    programDataClone.workouts.push({
      name: "",
      restSeconds: 0,
      exercises: [],
    });
    setProgramData(programDataClone);
    setMaximizedWorkout(programDataClone.workouts.length - 1);
  };
  const handleProgramNameChange = (text) => {
    if (!isProgramNameFocused) return;
    const dataClone = JSON.parse(JSON.stringify(programData));
    dataClone.name = text;
    setProgramData(dataClone);
  };
  const handleCreateWorkoutProgram = async () => {
    if (
      programData.name == "" ||
      programData.workouts.findIndex(
        (workout) =>
          workout.restSeconds == 0 ||
          workout.name == "" ||
          workout.exercises.length == 0
      ) != -1
    ) {
      setHighlightErrors(true);
    } else {
      setSubmitting(true);
      const programDataClone = {
        ...programData,
        creator: user.id,
        curremtUsersCount: 1,
      };
      const newWorkoutProgramRef = await addDoc(
        collection(db, "workoutPrograms"),
        programDataClone
      );
      await updateDoc(doc(db, "users", user.id), {
        savedWorkoutPrograms: arrayUnion(newWorkoutProgramRef.id),
      });
      navigation.goBack();
    }
  };
  const handleUpdateWorkoutProgram = async () => {
    if (
      programData.name == "" ||
      programData.workouts.findIndex(
        (workout) =>
          workout.restSeconds == 0 ||
          workout.name == "" ||
          workout.exercises.length == 0
      ) != -1
    ) {
      setHighlightErrors(true);
    } else {
      setSubmitting(true);
      await updateDoc(doc(db, "workoutPrograms", program.id), programData);
      navigation.replace("WorkoutPrograms");
    }
  };
  const isWorkoutMissingData = (workout) => {
    if (
      workout.restSeconds == 0 ||
      workout.name == "" ||
      workout.exercises.length == 0 ||
      workout.exercises.findIndex(
        (exercise) =>
          exercise.name == "" || exercise.reps == 0 || exercise.sets == 0
      ) != -1
    )
      return true;
    return false;
  };
  return (
    <ProgramContext.Provider
      value={{
        programData,
        setProgramData,
        maximizedWorkout,
        setMaximizedWorkout,
        highlightErrors,
        workoutsFlatListRef,
      }}
    >
      <View className="flex-1">
        <TopExitButton />
        <View
          className="flex-1"
          style={{
            paddingHorizontal: 16,
            rowGap: 10,
          }}
        >
          <View className="flex-row items-center" style={{ columnGap: 5 }}>
            <CustomText className="font-semibold text-xl">
              Program name:
            </CustomText>
            <CustomTextInput
              onFocus={() => setIsProgramNameFocused(true)}
              onBlur={() => setIsProgramNameFocused(false)}
              maxLength={20}
              error={highlightErrors && programData.name == ""}
              value={programData.name}
              onChangeText={handleProgramNameChange}
              style={{ backgroundColor: appStyle.color_surface_variant }}
            />
          </View>
          <View
            className="rounded p-2"
            style={{
              backgroundColor: appStyle.color_surface,
              borderColor: appStyle.color_outline,
              borderWidth: 0.5,
            }}
          >
            <CustomText className="font-semibold text-lg">
              {languageService[user.language].workouts + ":"}
            </CustomText>
            <View style={{ height: 50, justifyContent: "center" }}>
              <FlatList
                ref={workoutsFlatListRef}
                style={{}}
                scrollEnabled={true}
                keyboardShouldPersistTaps={"always"}
                data={programData.workouts}
                horizontal
                keyExtractor={(_, index) => index}
                showsHorizontalScrollIndicator
                contentContainerStyle={{
                  alignItems: "center",
                  paddingRight: 5,
                  columnGap: 10,
                }}
                ListHeaderComponent={
                  programData.workouts.length != maxWorkoutsPerProgram ? (
                    <CustomButton
                      style={{
                        marginRight: 10,
                        height: 40,
                        aspectRatio: 1 / 1,
                        backgroundColor:
                          programData.workouts.length != maxWorkoutsPerProgram
                            ? appStyle.color_surface_variant
                            : appStyle.color_surface,
                      }}
                      disabled={
                        programData.workouts.length == maxWorkoutsPerProgram
                      }
                      onPress={newWorkout}
                    >
                      <FontAwesomeIcon
                        color={
                          programData.workouts.length != maxWorkoutsPerProgram
                            ? appStyle.color_on_surface_variant
                            : appStyle.color_outline
                        }
                        icon={faPlusSquare}
                        size={30}
                      />
                    </CustomButton>
                  ) : (
                    <></>
                  )
                }
                renderItem={({ item, index }) => (
                  <CustomButton
                    onPress={() => setMaximizedWorkout(index)}
                    style={{
                      backgroundColor:
                        index == maximizedWorkout
                          ? appStyle.color_on_surface_variant
                          : appStyle.color_surface_variant,
                      minWidth: 50,
                      height: 40,
                      borderWidth: 1,
                      borderColor:
                        highlightErrors &&
                        isWorkoutMissingData(programData.workouts[index])
                          ? appStyle.color_error
                          : index == maximizedWorkout
                          ? appStyle.color_on_surface_variant
                          : appStyle.color_surface_variant,
                    }}
                  >
                    <CustomText
                      className="font-semibold"
                      style={{
                        color:
                          index == maximizedWorkout
                            ? appStyle.color_surface_variant
                            : appStyle.color_on_surface_variant,
                      }}
                    >
                      {item.name != "" ? item.name : index + 1}
                    </CustomText>
                  </CustomButton>
                )}
              />
            </View>
          </View>
          {/* <CustomButton
            disabled={programData.workouts.length == maxWorkoutsPerProgram}
            className="flex-row"
            onPress={newWorkout}
            style={{
              height: 40,
              borderColor: appStyle.color_outline,
              borderWidth: 0.5,
              columnGap: 3,
              padding: 10,
              borderRadius: 8,
              backgroundColor:
                programData.workouts.length == maxWorkoutsPerProgram
                  ? appStyle.color_surface_variant
                  : appStyle.color_primary,
            }}
          >
            {programData.workouts.length < maxWorkoutsPerProgram && (
              <FontAwesomeIcon
                color={appStyle.color_on_primary}
                icon={faPlusCircle}
                size={15}
              />
            )}
            <CustomText
              style={{
                color:
                  programData.workouts.length == maxWorkoutsPerProgram
                    ? appStyle.color_on_surface_variant
                    : appStyle.color_on_primary,
              }}
            >
              {programData.workouts.length == maxWorkoutsPerProgram
                ? languageService[user.language].cantHaveMoreWorkouts(
                    maxWorkoutsPerProgram
                  )
                : languageService[user.language].newWorkout}
            </CustomText>
          </CustomButton> */}
          {maximizedWorkout != null &&
            programData.workouts.length >= maximizedWorkout - 1 && (
              <EditingWorkout workoutIndex={maximizedWorkout} />
            )}
          <CustomButton
            onPress={
              program ? handleUpdateWorkoutProgram : handleCreateWorkoutProgram
            }
            round
            style={{
              width: "50%",
              alignSelf: "center",
              flexDirection: "row",
              height: 40,
              borderColor: appStyle.color_outline,
              borderWidth: 0.5,
              columnGap: 3,
              padding: 10,
              borderRadius: 8,
              backgroundColor: appStyle.color_on_background,
              marginBottom: 20,
            }}
          >
            <CustomText
              style={{
                color: appStyle.color_background,
                fontWeight: 600,
              }}
            >
              {submitting
                ? languageService[user.language].loading
                : program
                ? languageService[user.language].updateProgram
                : languageService[user.language].createProgram}
            </CustomText>
          </CustomButton>
        </View>
      </View>
    </ProgramContext.Provider>
  );
};

export default EditingWorkoutProgram;
