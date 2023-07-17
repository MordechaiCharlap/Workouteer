import {
  View,
  Text,
  FlatList,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import CustomText from "../components/basic/CustomText";
import CustomTextInput from "../components/basic/CustomTextInput";
import * as appStyle from "../utils/appStyleSheet";
import Header from "../components/Header";
import CustomButton from "../components/basic/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import AwesomeModal from "../components/AwesomeModal";
import RestTimePicker from "../components/workoutProgram/RestTimePicker";
import EditingWorkout from "../components/workoutProgram/EditingWorkout";

const CreateWorkoutProgramScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("CreateWorkoutProgram");
    }, [])
  );
  const [programName, setProgramName] = useState("");
  const [totalRestSeconds, setTotalRestSeconds] = useState(0);
  const [workouts, setWorkouts] = useState([
    { name: "", exercises: [{ name: "", sets: 0, reps: 0 }] },
  ]);
  const newWorkout = () => {
    const workoutsClone = workouts.slice();
    workoutsClone.push({
      name: "",
      exercises: [{ name: "", sets: 0, reps: 0 }],
    });
    setWorkouts(workoutsClone);
  };
  return (
    <View style={safeAreaStyle()}>
      <Header title={"Create new program"} goBackOption={true} />
      <View style={{ paddingHorizontal: 16, rowGap: 10, flex: 1 }}>
        <View className="flex-row items-center" style={{ columnGap: 5 }}>
          <CustomText>Program name:</CustomText>
          <CustomTextInput
            value={programName}
            onChangeText={(text) => setProgramName(text)}
            style={{ backgroundColor: appStyle.color_surface_variant }}
          />
        </View>
        <View className="flex-row items-center" style={{ columnGap: 5 }}>
          <CustomText>Rest time between sets:</CustomText>
          <RestTimePicker
            setTotalRestSeconds={setTotalRestSeconds}
            totalRestSeconds={totalRestSeconds}
          />
        </View>
        <CustomText>Workouts:</CustomText>
        <FlatList
          data={workouts}
          keyExtractor={(_, index) => index}
          scrollEnabled={true}
          contentContainerStyle={{ rowGap: 10 }}
          renderItem={({ item, index }) => (
            <EditingWorkout workout={item} workoutIndex={index} />
          )}
        />
        <CustomButton
          onPress={newWorkout}
          round
          style={{
            backgroundColor: appStyle.color_on_background,
            alignSelf: "center",
            flexDirection: "row",
            columnGap: 10,
          }}
        >
          <FontAwesomeIcon
            color={appStyle.color_background}
            icon={faPlusCircle}
            size={30}
          />
          <CustomText
            style={{
              color: appStyle.color_background,
              fontWeight: 600,
            }}
          >
            New workout
          </CustomText>
        </CustomButton>
      </View>
    </View>
  );
};

export default CreateWorkoutProgramScreen;
