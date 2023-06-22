import { View, Text } from "react-native";
import { React, useState } from "react";
import CheckBox from "../components/CheckBox";
import * as appStyle from "../utils/appStyleSheet";
import { useEffect } from "react";
import languageService from "../services/languageService";
import useAuth from "../hooks/useAuth";
const WorkoutSex = ({ value, size, isMale, sexChanged, color }) => {
  const [workoutSex, setWorkoutSex] = useState(value || "everyone");
  const { user } = useAuth();
  useEffect(() => {
    sexChanged(workoutSex);
  }, [workoutSex]);
  return (
    <View
      className={`items-center gap-x-2 ${
        user.language == "hebrew" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <View>
        <CheckBox
          style={{ borderRadius: 4 }}
          size={size}
          onValueChange={(value) =>
            value == true
              ? setWorkoutSex(isMale == true ? "men" : "women")
              : setWorkoutSex("everyone")
          }
          value={workoutSex != "everyone"}
        />
      </View>
      <Text style={{ color: color }}>
        {languageService[user.language][isMale ? "menOnly" : "womenOnly"]}
      </Text>
    </View>
  );
};

export default WorkoutSex;
