import { View, Text } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPause,
  faPlay,
  faRefresh,
  faRotateRight,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../utils/appStyleSheet";
import CustomText from "../components/basic/CustomText";
import CustomButton from "../components/basic/CustomButton";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { secondsToMinutesPlusSeconds } from "../utils/timeFunctions";
import Header from "../components/Header";
import CustomTextInput from "../components/basic/CustomTextInput";
import AwesomeModal from "../components/AwesomeModal";
import languageService from "../services/languageService";
import useAuth from "../hooks/useAuth";
const IntervalTimerScreen = () => {
  const { user } = useAuth();
  const { setCurrentScreen } = useNavbarDisplay();
  const [chosenTotalSeconds, setChosenTotalSeconds] = useState(120);
  const [chosenMinutes, setChosenMinutes] = useState();
  const [chosenSeconds, setChosenSeconds] = useState();
  const [intervalSeconds, setIntervalSeconds] = useState(chosenTotalSeconds);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState();
  const [showModal, setShowModal] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("IntervalTimer");
    }, [])
  );
  const restart = () => {
    setIntervalSeconds(120);
    setIsPlaying(true);
    const newTimer = setInterval(() => {
      setIntervalSeconds((prev) => prev - 1);
      console.log(intervalSeconds);
    }, 1000);
    setTimer(newTimer);
  };
  const stop = () => {
    setIsPlaying(false);
    setIntervalSeconds(chosenTotalSeconds);
    clearInterval(timer);
  };
  const pause = () => {
    setIsPlaying(false);
    clearInterval(timer);
  };
  const end = () => {
    setIsPlaying();
    clearInterval(timer);
  };
  const play = () => {
    setIsPlaying(true);
    const newTimer = setInterval(() => {
      setIntervalSeconds((prev) => prev - 1);
    }, 1000);
    setTimer(newTimer);
  };
  const handleSecondsChanged = (text) => {
    var validRegex = /(?:[0-5]?[0-9])?/;
    if (text.match(validRegex)) {
      setChosenSeconds(String(text));
    }
  };
  const handleMinutesChanged = (text) => {
    var validRegex = /(?:[0-5]?[0-9])?/;
    if (text.match(validRegex)) {
      setChosenMinutes(String(text));
    }
  };
  return (
    <View style={safeAreaStyle()}>
      <Header title={"IntervalTimer"} goBackOption={true} icon={"<"} />
      <View className="h-1/3 items-center justify-center">
        <View
          style={{
            width: "100%",
            alignItems: "center",
            backgroundColor: appStyle.color_primary_container,
            borderColor: appStyle.color_outline,
            borderWidth: 1,
          }}
        >
          <CustomText
            style={{
              fontSize: 100,
              color: appStyle.color_on_primary_container,
            }}
          >
            {secondsToMinutesPlusSeconds(intervalSeconds)}
          </CustomText>
        </View>
      </View>
      <View className="h-1/3 items-center justify-center">
        {isPlaying == true ? (
          <View className="flex-row">
            <CustomButton onPress={pause}>
              <FontAwesomeIcon
                icon={faPause}
                size={100}
                color={appStyle.color_success}
              />
            </CustomButton>
            <CustomButton onPress={stop}>
              <FontAwesomeIcon
                icon={faStop}
                size={100}
                color={appStyle.color_success}
              />
            </CustomButton>
          </View>
        ) : isPlaying == false ? (
          <CustomButton onPress={play}>
            <FontAwesomeIcon
              icon={faPlay}
              size={100}
              color={appStyle.color_success}
            />
          </CustomButton>
        ) : (
          <CustomButton onPress={restart}>
            <FontAwesomeIcon
              icon={faRotateRight}
              size={100}
              color={appStyle.color_success}
            />
          </CustomButton>
        )}
      </View>
      <View className="h-1/3 items-center justify-center">
        {!isPlaying && (
          <CustomButton
            onPress={() => setShowModal(true)}
            style={{
              backgroundColor: appStyle.color_surface_variant,
              borderColor: appStyle.color_outline,
              borderWidth: 1,
            }}
          >
            <CustomText className="text-xl" style={{}}>
              Change resting time
            </CustomText>
          </CustomButton>
        )}
      </View>
      <AwesomeModal
        onDismiss={() => {
          setShowModal(false);
        }}
        onConfirmPressed={() => {
          setShowModal(false);
          setChosenTotalSeconds(
            60 * parseInt(chosenMinutes || 0) + parseInt(chosenSeconds || 0)
          );
          setIntervalSeconds(
            60 * parseInt(chosenMinutes || 0) + parseInt(chosenSeconds || 0)
          );
        }}
        setShowModal={setShowModal}
        title={
          languageService[user.language].choose[user.isMale ? 1 : 0] +
          " " +
          languageService[user.language].duration
        }
        showModal={showModal}
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
                    keyboardType="numeric"
                    maxLength={2}
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

export default IntervalTimerScreen;
