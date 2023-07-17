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
  const [showRestModal, setShowRestModal] = useState(false);
  const [restMinutes, setRestMinutes] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);
  const [minutesFocused, setMinutesFocused] = useState(false);
  const [secondsFocused, setSecondsFocused] = useState(false);
  const handleMinutesChanged = (text) => {
    if (!minutesFocused) {
      console.log("not focused");
      return;
    }
    var validRegex = /(?:[0-5]?[0-9])?/;
    if (text.match(validRegex)) {
      console.log("match");
      setRestMinutes(String(text));
    } else {
      console.log("not match");
      setRestMinutes("00");
    }
  };
  const handleSecondsChanged = (text) => {
    if (!secondsFocused) return;

    console.log(text);
    var validRegex = /(?:[0-5]?[0-9])?/;
    if (text.match(validRegex)) {
      console.log("match");
      setRestSeconds(String(text));
    } else {
      console.log("not match");
      setRestSeconds("00");
    }
  };

  const minutesBlur = () => {
    setMinutesFocused(false);
    setRestMinutes(String(restMinutes).padStart(2, "0"));
  };
  const secondsBlur = () => {
    setSecondsFocused(false);
    setRestSeconds(String(restSeconds).padStart(2, "0"));
  };
  useEffect(() => {
    secondsBlur();
    minutesBlur();
  }, [showRestModal]);
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
            onPress={() => {
              setShowRestModal(true);
            }}
            style={{ backgroundColor: appStyle.color_surface_variant }}
          >
            <CustomText>
              {restSeconds != 0 || restMinutes != 0
                ? `${restMinutes}:${restSeconds}`
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
        onDismiss={() => {}}
        setShowModal={setShowRestModal}
        title={"Choose duration"}
        showModal={showRestModal}
        confirmText={"Set"}
        customView={
          <View className="flex-row" style={{ columnGap: 10, height: 50 }}>
            <View>
              <CustomText>minutes</CustomText>
              <View>
                <CustomTextInput
                  style={{ backgroundColor: appStyle.color_surface_variant }}
                  textAlign="center"
                  value={restMinutes}
                  onBlur={minutesBlur}
                  keyboardType="numeric"
                  maxLength={2}
                  onFocus={() => setMinutesFocused(true)}
                  onChangeText={(text) => handleMinutesChanged(text)}
                ></CustomTextInput>
              </View>
            </View>
            <View>
              <CustomText></CustomText>
              <CustomText
                style={{
                  minHeight: 40,
                  fontSize: 20,
                  textAlign: "center",
                  textAlignVertical: "center",
                }}
              >
                :
              </CustomText>
            </View>
            <View>
              <CustomText>seconds</CustomText>
              <View>
                <CustomTextInput
                  style={{ backgroundColor: appStyle.color_surface_variant }}
                  textAlign="center"
                  value={restSeconds}
                  onBlur={secondsBlur}
                  onFocus={() => setSecondsFocused(true)}
                  keyboardType="numeric"
                  maxLength={2}
                  onChangeText={(text) => handleSecondsChanged(text)}
                ></CustomTextInput>
              </View>
            </View>
          </View>
        }
      />
    </View>
  );
};

export default CreateWorkoutProgramScreen;
