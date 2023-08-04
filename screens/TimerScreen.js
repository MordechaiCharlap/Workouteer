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
import { Audio } from "expo-av";
const TimerScreen = ({ route }) => {
  const { user } = useAuth();
  const { setCurrentScreen } = useNavbarDisplay();
  const [chosenTotalSeconds, setChosenTotalSeconds] = useState(10);
  const [chosenMinutes, setChosenMinutes] = useState();
  const [chosenSeconds, setChosenSeconds] = useState();
  const [intervalSeconds, setIntervalSeconds] = useState(chosenTotalSeconds);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState();
  const [showModal, setShowModal] = useState(false);
  const [shortBeepSound, setShortBeepSound] = useState();
  const [longBeepSound, setLongBeepSound] = useState();
  const [systemVolume, setSystemVolume] = useState();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Timer");
    }, [])
  );
  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
    });
    return () => {
      shortBeepSound && shortBeepSound.unloadAsync();
      longBeepSound && longBeepSound.unloadAsync();
    };
  }, [shortBeepSound, longBeepSound]);
  async function playShortBeep() {
    if (Platform.OS == "web") return;
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/audio/smallest_beep.mp3"),
      { volume: 1 }
    );
    if (!shortBeepSound) setShortBeepSound(sound);
    await sound.playAsync();
  }
  async function playLongBeep() {
    if (Platform.OS == "web") return;
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/audio/half_second_beep.mp3"),
      { volume: 1 }
    );
    if (!longBeepSound) setLongBeepSound(sound);
    await sound.playAsync();
  }
  useEffect(() => {
    if (!isPlaying && timer) {
      clearInterval(timer);
      setTimer();
    }
    return () => {
      clearInterval(timer);
      setTimer();
    };
  }, [isPlaying]);
  const restart = () => {
    setIntervalSeconds(chosenTotalSeconds);
    play();
  };
  const stop = () => {
    setIsPlaying(false);
    setIntervalSeconds(chosenTotalSeconds);
  };
  const pause = () => {
    setIsPlaying(false);
  };
  const end = () => {
    playLongBeep();
    setIsPlaying();
  };
  const play = () => {
    playLongBeep();
    setIsPlaying(true);
    setTimer(
      setInterval(() => {
        setIntervalSeconds((prev) => {
          if (prev - 1 <= 0) {
            playShortBeep();
            end();
          } else if (prev - 1 <= 3) playShortBeep();
          return prev - 1;
        });
      }, 1000)
    );
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

export default TimerScreen;
