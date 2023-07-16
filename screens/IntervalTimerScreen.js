import { View, Text } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import CustomButton from "../components/basic/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPause,
  faPlay,
  faRefresh,
  faRotateRight,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import * as appStlye from "../utils/appStyleSheet";
import CustomText from "../components/basic/CustomText";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { secondsToMinutesPlusSeconds } from "../utils/timeFunctions";
const IntervalTimerScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const [intervalSeconds, setIntervalSeconds] = useState(120);
  const [isPlaying, setIsPlaying] = useState();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("IntervalTimer");
    }, [])
  );
  useEffect(() => {}, []);
  return (
    <View style={safeAreaStyle()}>
      <View className="h-1/3 items-center justify-center">
        <View
          style={{
            width: "100%",
            alignItems: "center",
            backgroundColor: appStlye.color_primary_container,
            borderColor: appStlye.color_outline,
            borderWidth: 1,
          }}
        >
          <CustomText
            style={{
              fontSize: 100,
              color: appStlye.color_on_primary_container,
            }}
          >
            {secondsToMinutesPlusSeconds(intervalSeconds)}
          </CustomText>
        </View>
      </View>
      <View className="h-1/3 items-center justify-center">
        {isPlaying == true ? (
          <View className="flex-row">
            <CustomButton>
              <FontAwesomeIcon
                icon={faStop}
                size={100}
                color={appStlye.color_success}
              />
            </CustomButton>
            <CustomButton>
              <FontAwesomeIcon
                icon={faPause}
                size={100}
                color={appStlye.color_success}
              />
            </CustomButton>
          </View>
        ) : isPlaying == false ? (
          <CustomButton>
            <FontAwesomeIcon
              icon={faPlay}
              size={100}
              color={appStlye.color_success}
            />
          </CustomButton>
        ) : (
          <CustomButton>
            <FontAwesomeIcon
              icon={faRotateRight}
              size={100}
              color={appStlye.color_success}
            />
          </CustomButton>
        )}
      </View>
      <View className="h-1/3 items-center justify-center">
        {!isPlaying && (
          <CustomButton
            style={{
              backgroundColor: appStlye.color_surface_variant,
              borderColor: appStlye.color_outline,
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
