import { View, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import CustomButton from "../basic/CustomButton";
import CustomText from "../basic/CustomText";
import AwesomeModal from "../AwesomeModal";
import CustomTextInput from "../basic/CustomTextInput";
import * as appStyle from "../../utils/appStyleSheet";
import { ProgramContext } from "./EditingWorkoutProgram";
import languageService from "../../services/languageService";
import useAuth from "../../hooks/useAuth";

const RestTimePicker = ({ workoutIndex, containerColor, onContainerColor }) => {
  const { user } = useAuth();
  const { programData, setProgramData, maximizedWorkout, highlightErrors } =
    useContext(ProgramContext);
  const [showRestModal, setShowRestModal] = useState(false);
  const [restMinutes, setRestMinutes] = useState();
  const [restSeconds, setRestSeconds] = useState();
  const [minutesFocused, setMinutesFocused] = useState(false);
  const [secondsFocused, setSecondsFocused] = useState(false);
  const handleMinutesChanged = (text) => {
    if (!minutesFocused) {
      return;
    }
    var validRegex = /(?:[0-5]?[0-9])?/;
    if (text.match(validRegex)) {
      setRestMinutes(String(text));
    } else {
      setRestMinutes("00");
    }
  };
  const handleSecondsChanged = (text) => {
    if (!secondsFocused) return;

    var validRegex = /(?:[0-5]?[0-9])?/;
    if (text.match(validRegex)) {
      setRestSeconds(String(text));
    } else {
      setRestSeconds("00");
    }
  };
  const confirmRestTime = () => {
    const programDataClone = JSON.parse(JSON.stringify(programData));
    programDataClone.workouts[workoutIndex].restSeconds =
      parseInt(restMinutes || 0) * 60 + parseInt(restSeconds || 0);
    setProgramData(programDataClone);
  };
  return (
    <View className="flex-1">
      <CustomButton
        onPress={() => {
          setShowRestModal(true);
        }}
        style={{
          backgroundColor: onContainerColor,
          borderWidth: 1,
          borderColor:
            highlightErrors &&
            programData.workouts[workoutIndex].restSeconds == 0
              ? appStyle.color_error
              : onContainerColor,
        }}
      >
        <CustomText style={{ color: containerColor, fontWeight: 500 }}>
          {programData.workouts[workoutIndex].restSeconds
            ? `${String(
                parseInt(programData.workouts[workoutIndex].restSeconds / 60)
              ).padStart(2, "0")}:${String(
                programData.workouts[workoutIndex].restSeconds % 60
              ).padStart(2, "0")}`
            : languageService[user.language].choose[user.isMale ? 1 : 0]}
        </CustomText>
      </CustomButton>
      <AwesomeModal
        onDismiss={() => {
          setShowRestModal(false);
        }}
        onConfirmPressed={() => {
          setShowRestModal(false);
          confirmRestTime();
        }}
        setShowModal={setShowRestModal}
        title={
          languageService[user.language].choose[user.isMale ? 1 : 0] +
          " " +
          languageService[user.language].duration
        }
        showModal={showRestModal}
        confirmText={languageService[user.language].confirm}
        customView={
          <View>
            <View className="flex-row" style={{ columnGap: 10, height: 50 }}>
              <View>
                <CustomText>
                  {languageService[user.language].minutes}
                </CustomText>
                <View>
                  <CustomTextInput
                    style={{ backgroundColor: appStyle.color_surface_variant }}
                    textAlign="center"
                    value={restMinutes}
                    // onBlur={minutesBlur}
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
                <CustomText>
                  {languageService[user.language].seconds}
                </CustomText>
                <View>
                  <CustomTextInput
                    style={{ backgroundColor: appStyle.color_surface_variant }}
                    textAlign="center"
                    value={restSeconds}
                    // onBlur={secondsBlur}
                    onFocus={() => setSecondsFocused(true)}
                    keyboardType="numeric"
                    maxLength={2}
                    onChangeText={(text) => handleSecondsChanged(text)}
                  ></CustomTextInput>
                </View>
              </View>
            </View>
          </View>
        }
      />
    </View>
  );
};

export default RestTimePicker;
