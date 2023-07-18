import { View } from "react-native";
import CustomText from "../basic/CustomText";
import CustomButton from "../basic/CustomButton";
import CustomTextInput from "../basic/CustomTextInput";
import {
  faMinimize,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import {
  color_background,
  color_error,
  color_on_background,
} from "../../utils/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useContext, useState } from "react";
import { ProgramContext } from "../../screens/CreateWorkoutProgramScreen";
const EditingWorkoutHeader = ({ workoutIndex }) => {
  const { programData, setProgramData, maximizedWorkout, setMaximizedWorkout } =
    useContext(ProgramContext);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const deleteWorkout = () => {
    const programDataClone = { ...programData };
    programDataClone.workouts.splice(workoutIndex, 1);
    if (maximizedWorkout == workoutIndex) setMaximizedWorkout();
    else if (maximizedWorkout > workoutIndex)
      setMaximizedWorkout((prev) => prev - 1);
    setProgramData(programDataClone);
  };
  const handleWorkoutNameChange = (text) => {
    if (!isNameFocused) return;
    const programDataClone = { ...programData };
    programDataClone.workouts[workoutIndex].name = text;
    setProgramData(programDataClone);
  };
  return (
    <View className="flex-row items-center" style={{ columnGap: 10 }}>
      <CustomText>Name:</CustomText>
      <CustomTextInput
        value={programData.workouts[workoutIndex].name}
        onFocus={() => setIsNameFocused(true)}
        onBlur={() => setIsNameFocused(false)}
        onChangeText={handleWorkoutNameChange}
      />
      <CustomButton
        style={{
          backgroundColor: color_background,
        }}
        onPress={() =>
          maximizedWorkout == workoutIndex
            ? setMaximizedWorkout(null)
            : setMaximizedWorkout(workoutIndex)
        }
      >
        <FontAwesomeIcon
          icon={maximizedWorkout == workoutIndex ? faMinimize : faPen}
          color={color_on_background}
          size={15}
        />
      </CustomButton>
      <CustomButton
        style={{
          backgroundColor: color_background,
        }}
        onPress={deleteWorkout}
      >
        <FontAwesomeIcon icon={faTrashCan} color={color_error} size={15} />
      </CustomButton>
    </View>
  );
};
export default EditingWorkoutHeader;
