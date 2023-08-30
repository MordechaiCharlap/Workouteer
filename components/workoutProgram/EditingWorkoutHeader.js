import { StyleSheet, View } from "react-native";
import CustomText from "../basic/CustomText";
import CustomButton from "../basic/CustomButton";
import CustomTextInput from "../basic/CustomTextInput";
import {
  faMinimize,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { color_outline } from "../../utils/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState } from "react";
import { useWorkoutProgram } from "./EditingWorkoutProgram";
import languageService from "../../services/languageService";
import useAuth from "../../hooks/useAuth";
const EditingWorkoutHeader = ({
  workoutIndex,
  containerColor,
  onContainerColor,
}) => {
  const { user } = useAuth();
  const {
    programData,
    setProgramData,
    maximizedWorkout,
    setMaximizedWorkout,
    highlightErrors,
    workoutsFlatListRef,
  } = useWorkoutProgram();
  const [isNameFocused, setIsNameFocused] = useState(false);
  const deleteWorkout = () => {
    const programDataClone = JSON.parse(JSON.stringify(programData));
    programDataClone.workouts.splice(workoutIndex, 1);
    if (maximizedWorkout == workoutIndex) {
      if (
        programDataClone.workouts.length >= maximizedWorkout + 1 ||
        programDataClone.workouts.length == 0
      ) {
      } else {
        setMaximizedWorkout(maximizedWorkout - 1);
      }
    }
    if (programDataClone.workouts.length == 0)
      programDataClone.workouts.push({
        name: "",
        restSeconds: 0,
        exercises: [],
      });
    setProgramData(programDataClone);
    workoutsFlatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };
  const handleWorkoutNameChange = (text) => {
    if (!isNameFocused) return;
    const programDataClone = JSON.parse(JSON.stringify(programData));
    programDataClone.workouts[workoutIndex].name = text;
    setProgramData(programDataClone);
  };
  return (
    <View
      className={`flex-row${
        user.language == "hebrew" ? "-reverse" : ""
      } items-center`}
      style={{ columnGap: 10 }}
    >
      <CustomText
        className="text-lg semibold"
        style={{ color: onContainerColor }}
      >
        {languageService[user.language].name.charAt(0).toUpperCase() +
          languageService[user.language].name.slice(1) +
          ":"}
      </CustomText>
      <CustomTextInput
        style={{ backgroundColor: onContainerColor, color: containerColor }}
        maxLength={20}
        error={highlightErrors && programData.workouts[workoutIndex].name == ""}
        value={programData.workouts[workoutIndex].name}
        onFocus={() => setIsNameFocused(true)}
        onBlur={() => setIsNameFocused(false)}
        onChangeText={handleWorkoutNameChange}
      />
      {/* <CustomButton
        style={{
          borderWidth: 1,
          borderColor: color_outline,
          backgroundColor: onContainerColor,
        }}
        onPress={() =>
          maximizedWorkout == workoutIndex
            ? setMaximizedWorkout(null)
            : setMaximizedWorkout(workoutIndex)
        }
      >
        <FontAwesomeIcon
          icon={maximizedWorkout == workoutIndex ? faMinimize : faPen}
          color={containerColor}
          size={15}
        />
      </CustomButton> */}
      <CustomButton
        style={{
          borderWidth: 1,
          borderColor: color_outline,
          backgroundColor: onContainerColor,
        }}
        onPress={deleteWorkout}
      >
        <FontAwesomeIcon icon={faTrashCan} color={containerColor} size={15} />
      </CustomButton>
    </View>
  );
};
export default EditingWorkoutHeader;
