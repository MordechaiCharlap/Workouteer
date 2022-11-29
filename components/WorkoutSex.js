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
    if (mySexCB) {
      if (workoutSex != null) {
        console.log("changing everyone to false");
        setEveryoneCB(false);
      }
      setWorkoutSex(props.user.isMale ? "men" : "women");
    }
  }, [mySexCB]);
  useEffect(() => {
    if (everyoneCB) {
      if (workoutSex != null) {
        console.log("changing mySex to false");
        setMySexCB(false);
      }
      setWorkoutSex("everyone");
    }
  }, [everyoneCB]);

  const renderCheckBox = (type) => {
    if (type == "mySex") {
      console.log("rendering mySex with", mySexCB);
      return (
        <View className="flex-row mr-5 items-center">
          <CheckBox
            onValueChange={(value) => setMySexCB(value)}
            backgroundColor={appStyle.appAzure}
            valueColor={appStyle.appDarkBlue}
            value={mySexCB}
          />
          <Text>Only {props.user.isMale ? "Men" : "Women"}</Text>
        </View>
      );
    } else {
      console.log("rendering mySex with", everyoneCB);
      return (
        <View className="flex-row items-center">
          <CheckBox
            onValueChange={(value) => setEveryoneCB(value)}
            backgroundColor={appStyle.appAzure}
            valueColor={appStyle.appDarkBlue}
            value={everyoneCB}
          />
          <Text>Everyone</Text>
        </View>
      );
    }
  };
  return (
    <View className="flex-row">
      {renderCheckBox("mySex")}
      {renderCheckBox("everyone")}
    </View>
  );
};

export default WorkoutSex;
