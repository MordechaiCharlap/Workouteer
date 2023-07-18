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
const EditingWorkoutHeader = ({
  maximized,
  minimizeWorkout,
  maximizeWorkout,
  workoutName,
  setWorkoutName,
  deleteWorkout,
}) => {
  return (
    <View className="flex-row items-center" style={{ columnGap: 10 }}>
      <CustomText>Name:</CustomText>
      <CustomTextInput value={workoutName} onChangeText={setWorkoutName} />
      <CustomButton
        style={{
          backgroundColor: color_background,
        }}
        onPress={maximized ? minimizeWorkout : maximizeWorkout}
      >
        <FontAwesomeIcon
          icon={maximized ? faMinimize : faPen}
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
