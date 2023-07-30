import { View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck, faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../utils/appStyleSheet";
import CustomText from "../components/basic/CustomText";
import CustomButton from "../components/basic/CustomButton";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { secondsToMinutesPlusSeconds } from "../utils/timeFunctions";
import useAuth from "../hooks/useAuth";
import ProgressBar from "../components/ProgressBar";
import { convertHexToRgba } from "../utils/stylingFunctions";
import appComponentsDefaultStyles from "../utils/appComponentsDefaultStyles";
import { Audio } from "expo-av";

const IntervalTimerScreen = ({ route }) => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const workout = route.params?.workout;
  const [allSets, setAllSets] = useState();
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const { setCurrentScreen } = useNavbarDisplay();
  const [intervalSeconds, setIntervalSeconds] = useState(workout.restSeconds);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState();
  const [shortBeepSound, setShortBeepSound] = useState();
  const [longBeepSound, setLongBeepSound] = useState();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("IntervalTimer");
    }, [])
  );
  async function playShortBeep() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/audio/smallest-beep.mp3")
    );
    if (!shortBeepSound) setShortBeepSound(sound);
    await sound.playAsync();
  }
  async function playLongBeep() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/audio/half-second-beep.mp3")
    );
    if (!longBeepSound) setLongBeepSound(sound);
    await sound.playAsync();
  }
  useEffect(() => {
    return () => {
      shortBeepSound && shortBeepSound.unloadAsync();
      longBeepSound && longBeepSound.unloadAsync();
    };
    // return shortBeepSound
    //   ? () => {
    //       console.log("Unloading Sound");
    //       shortBeepSound.unloadAsync();
    //     }
    //   : undefined;
  }, [shortBeepSound, longBeepSound]);

  useEffect(() => {
    const intervalSets = [];
    workout.exercises.forEach((exercise) => {
      for (var i = 0; i < exercise.sets; i++) {
        intervalSets.push({ name: exercise.name, reps: exercise.reps });
      }
    });
    setAllSets(intervalSets);
  }, []);
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
    setIsPlaying(true);
    setIntervalSeconds(workout.restSeconds);
    setTimer(
      setInterval(() => {
        setIntervalSeconds((prev) => {
          if (prev - 1 <= 0) {
            end();
          }

          return prev - 1;
        });
      }, 1000)
    );
  };
  const stop = () => {
    setIsPlaying(false);
    setIntervalSeconds(restSeconds);
  };
  const pause = () => {
    setIsPlaying(false);
  };
  // const tripleBeep = () => {
  //   var counter = 0;
  //   playSound();
  //   counter++;
  //   const intervalId = setInterval(() => {
  //     playSound();
  //     counter++;

  //     if (counter === 3) {
  //       clearInterval(intervalId);
  //     }
  //   }, 300);
  // };
  const startBeep = () => {
    playLongBeep();
  };
  const endBeep = () => {
    playLongBeep();
  };
  const end = () => {
    setIsPlaying();
    endBeep();
    setCurrentSetIndex((prev) => prev + 1);
    setIntervalSeconds(workout.restSeconds);
  };
  const play = () => {
    setIsPlaying(true);
    startBeep();
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
  const finishWorkout = () => {
    navigation.navigate("Home");
  };

  const onContainerColor = isPlaying
    ? appStyle.color_on_background
    : appStyle.color_on_primary;
  return (
    allSets != null &&
    currentSetIndex != null && (
      <View
        style={[
          safeAreaStyle(),
          {
            backgroundColor:
              isPlaying == true
                ? appStyle.color_success
                : appStyle.color_primary,
          },
        ]}
      >
        <View
          className="h-1/3 items-center justify-center"
          style={{ paddingHorizontal: 16 }}
        >
          <CustomText
            className="text-8xl font-black"
            style={{
              color: convertHexToRgba(onContainerColor, 0.3),
              letterSpacing: 4,
            }}
          >
            {isPlaying ? "REST" : "WORK"}
          </CustomText>
          {/* {!isPlaying && (
            <View className="absolute w-full bottom-0 items-center">
              <CustomText
                className="text-3xl font-semibold"
                style={{ color: onContainerColor }}
              >
                {allSets[currentSetIndex].name}
              </CustomText>
              <CustomText
                className="text-xl font-semibold"
                style={{ color: onContainerColor, marginBottom: 15 }}
              >
                {allSets[currentSetIndex].reps} reps
              </CustomText>
            </View>
          )} */}
        </View>
        <View className="h-1/3 justify-center items-center">
          {isPlaying ? (
            <CustomText
              style={{
                fontSize: 100,
                color: appStyle.color_on_primary_container,
              }}
            >
              {secondsToMinutesPlusSeconds(intervalSeconds)}
            </CustomText>
          ) : (
            <View className="w-full items-center">
              <CustomText
                className="text-5xl font-bold text-center"
                style={{ color: onContainerColor }}
              >
                {allSets[currentSetIndex].name}
              </CustomText>
              <CustomText
                className="text-3xl font-bold"
                style={{ color: onContainerColor, marginBottom: 15 }}
              >
                {allSets[currentSetIndex].reps} reps
              </CustomText>
            </View>
          )}
        </View>
        <View className="h-1/3 items-center">
          <View className="flex-1 justify-center">
            {/* <CustomText
              className="text-5xl font-semibold"
              style={{ color: onContainerColor }}
            >
              {allSets.length - 1 == currentSetIndex
                ? "FINISH WORKOUT"
                : "FINISH SET"}
            </CustomText> */}

            {!isPlaying && (
              <View
                className="rounded-full"
                style={[
                  {
                    backgroundColor: appStyle.color_success,
                    padding: 15,
                    borderColor: appStyle.color_background,
                    borderWidth: 5,
                  },
                  appComponentsDefaultStyles.shadow,
                ]}
              >
                <CustomButton
                  onPress={() => {
                    allSets.length - 1 == currentSetIndex
                      ? finishWorkout()
                      : play();
                  }}
                >
                  <FontAwesomeIcon
                    icon={
                      allSets.length - 1 == currentSetIndex
                        ? faFlagCheckered
                        : faCheck
                    }
                    size={60}
                    color={appStyle.color_background}
                  />
                </CustomButton>
              </View>
            )}
          </View>
          <View
            className="w-full items-center justify-center"
            style={{ paddingBottom: 16 }}
          >
            <CustomText
              style={{ color: onContainerColor }}
              className="font-semibold text-3xl"
            >{`${currentSetIndex + 1} out of ${
              allSets.length
            } total sets`}</CustomText>
            <View
              className="w-full"
              style={{ height: 15, paddingHorizontal: 30 }}
            >
              <ProgressBar
                previousValue={currentSetIndex}
                value={currentSetIndex + 1}
                total={allSets.length}
                backgroundColor={appStyle.color_background}
                color={
                  isPlaying == true
                    ? appStyle.color_primary
                    : appStyle.color_success
                }
              />
            </View>
          </View>
        </View>
      </View>
    )
  );
};

export default IntervalTimerScreen;
