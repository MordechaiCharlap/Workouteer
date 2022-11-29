import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { React, useState } from "react";
import CheckBox from "../components/CheckBox";
import * as appStyle from "./AppStyleSheet";
import { useEffect } from "react";
const WorkoutSex = (props) => {
  const [workoutSex, setWorkoutSex] = useState(null);
  const [mySexCB, setMySexCB] = useState(false);
  const [everyoneCB, setEveryoneCB] = useState(false);
  useEffect(() => {
    if (mySexCB == true && everyoneCB == false)
      setWorkoutSex(props.user.isMale ? "men" : "women");
  }, [mySexCB, everyoneCB]);
  return (
    <View className="flex-row">
      <View className="flex-row mr-5 items-center">
        <CheckBox
          onValueChange={(value) => setMySexCB(value)}
          backgroundColor={appStyle.appAzure}
          valueColor={appStyle.appDarkBlue}
          value={mySexCB}
        />
        <Text>Only {props.user.isMale ? "Men" : "Women"}</Text>
      </View>
      <View className="flex-row items-center">
        <CheckBox
          onValueChange={(value) => setEveryoneCB(value)}
          backgroundColor={appStyle.appAzure}
          valueColor={appStyle.appDarkBlue}
          value={everyoneCB}
        />
        <Text>Everyone</Text>
      </View>
    </View>
  );
};

export default WorkoutSex;
