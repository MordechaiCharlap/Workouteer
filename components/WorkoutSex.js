import { View, Text } from "react-native";
import { React, useState } from "react";
import CheckBox from "../components/CheckBox";
import * as appStyle from "../utilities/appStyleSheet";
import { useEffect } from "react";
import languageService from "../services/languageService";
const WorkoutSex = (props) => {
  const [workoutSex, setWorkoutSex] = useState(
    props.value != null ? props.value : "everyone"
  );
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
          style={{ borderRadius: 4 }}
          size={props.size}
          onValueChange={(value) =>
            value == true
              ? setWorkoutSex(props.isMale == true ? "men" : "women")
              : setWorkoutSex("everyone")
          }
          backgroundColor={appStyle.color_primary}
          valueColor={appStyle.color_on_primary}
          value={workoutSex != "everyone"}
        />
      </View>
      <Text style={{ color: appStyle.color_primary }}>
        {
          languageService[props.language][
            props.isMale ? "menOnly" : "womenOnly"
          ]
        }
      </Text>
    </View>
  );
};

export default WorkoutSex;
