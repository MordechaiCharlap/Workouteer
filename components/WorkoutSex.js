import { View, Text } from "react-native";
import { React, useState } from "react";
import CheckBox from "../components/CheckBox";
import * as appStyle from "./AppStyleSheet";
import { useEffect } from "react";
import languageService from "../services/languageService";
const WorkoutSex = (props) => {
  const [workoutSex, setWorkoutSex] = useState("everyone");
  useEffect(() => {
    props.sexChanged(workoutSex);
  }, [workoutSex]);
  return (
    <View
      className={`items-center gap-x-2 ${
        props.language == "hebrew" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <View>
        <CheckBox
          onValueChange={(value) =>
            value == true
              ? setWorkoutSex("everyone")
              : setWorkoutSex(props.isMale == true ? "men" : "women")
          }
          backgroundColor={appStyle.color_primary}
          valueColor={appStyle.color_on_primary}
          value={true}
        />
      </View>
      <Text style={{ color: appStyle.color_primary }}>
        {workoutSex == "everyone"
          ? languageService[props.language].openForEveryone
          : languageService[props.language][
              props.isMale ? "menOnly" : "womenOnly"
            ]}
      </Text>
    </View>
  );
};

export default WorkoutSex;
