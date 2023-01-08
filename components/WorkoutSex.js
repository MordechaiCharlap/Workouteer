import { View, Text } from "react-native";
import { React, useState } from "react";
import CheckBox from "../components/CheckBox";
import * as appStyle from "./AppStyleSheet";
import { useEffect } from "react";
const WorkoutSex = (props) => {
  const [workoutSex, setWorkoutSex] = useState("everyone");
  useEffect(() => {
    props.sexChanged(workoutSex);
  }, [workoutSex]);
  return (
    <View className="flex-row items-center">
      <CheckBox
        onValueChange={(value) =>
          value == true
            ? setWorkoutSex("everyone")
            : setWorkoutSex(props.user.isMale == true ? "men" : "women")
        }
        backgroundColor={appStyle.color_primary}
        valueColor={appStyle.color_on_primary}
        value={true}
      />
      <Text className="ml-2" style={{ color: appStyle.color_primary }}>
        {props.text}
      </Text>
    </View>
  );
};

export default WorkoutSex;
