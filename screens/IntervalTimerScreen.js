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
const IntervalTimerScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const [chosenSeconds, setChosenSeconds] = useState(120);
  const [intervalSeconds, setIntervalSeconds] = useState(chosenSeconds);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState();
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
    setIntervalSeconds(chosenSeconds);
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
    </View>
  );
};

export default IntervalTimerScreen;
