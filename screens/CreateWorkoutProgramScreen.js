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
import { secondsToMinutesPlusSeconds } from "../utils/timeFunctions";
import AwesomeModal from "../components/AwesomeModal";
import { TextInput } from "react-native-gesture-handler";

const CreateWorkoutProgramScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("CreateWorkoutProgram");
    }, [])
  );
  const [workouts, setWorkouts] = useState([]);
  const [restSeconds, setRestSeconds] = useState();
  const [showRestModal, setShowRestModal] = useState(true);
  const [restNumbers, setRestNumbers] = useState(
    Array.from({ length: 60 }, (_, index) => index)
  );
  const [selectedNumber, setSelectedNumber] = useState(0);

  return (
    <View style={safeAreaStyle()}>
      <Header title={"Create new program"} goBackOption={true} />
      <View style={{ paddingHorizontal: 16, rowGap: 10 }}>
        <View className="flex-row items-center" style={{ columnGap: 5 }}>
          <CustomText>Program name:</CustomText>
          <CustomTextInput
            style={{ backgroundColor: appStyle.color_surface_variant }}
          />
        </View>
        <View className="flex-row items-center" style={{ columnGap: 5 }}>
          <CustomText>Rest time between sets:</CustomText>
          <CustomButton
            style={{ backgroundColor: appStyle.color_surface_variant }}
          >
            <CustomText>
              {restSeconds
                ? secondsToMinutesPlusSeconds(restSeconds)
                : "Choose"}
            </CustomText>
          </CustomButton>
        </View>
        <FlatList data={workouts} />
        <CustomButton
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
      <AwesomeModal
        onDismiss={() => setShowRestModal(false)}
        setShowModal={setShowRestModal}
        title={"Choose duration"}
        showModal={showRestModal}
        confirmText={"Set"}
        customView={
          <View className="flex-row" style={{ columnGap: 10, height: 50 }}>
            <View>
              <CustomText>minutes</CustomText>
              <View>
                <CustomTextInput keyboardType="numeric"></CustomTextInput>
              </View>
            </View>
            <View>
              <CustomText>seconds</CustomText>
              <View>
                <CustomTextInput keyboardType="numeric"></CustomTextInput>
              </View>
            </View>
          </View>
        }
      />
    </View>
  );
};

export default CreateWorkoutProgramScreen;
