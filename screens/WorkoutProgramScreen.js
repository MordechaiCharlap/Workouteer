import { View, Text, FlatList, TouchableOpacity } from "react-native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as appStyle from "../utils/appStyleSheet";
import CustomText from "../components/basic/CustomText";
import CustomButton from "../components/basic/CustomButton";
import { safeAreaStyle } from "../components/safeAreaStyle";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPenAlt, faPlay } from "@fortawesome/free-solid-svg-icons";
import appComponentsDefaultStyles from "../utils/appComponentsDefaultStyles";
import languageService from "../services/languageService";
import { convertHexToRgba } from "../utils/stylingFunctions";
const WorkoutProgramScreen = ({ route }) => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();
  const { user } = useAuth();
  const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState();
  const program = route.params.program;
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("WorkoutProgram");
    }, [])
  );
  const onContainerColor = appStyle.color_on_primary_container;
  const containerColor = appStyle.color_surface_variant;
  const disabledColor = convertHexToRgba(onContainerColor, 0.3);
  const workoutButton = (onPress, icon) => {
    return (
      <CustomButton
        onPress={onPress}
        className="rounded-full"
        style={{
          backgroundColor: onContainerColor,
          padding: 15,
          borderColor: containerColor,
          borderWidth: 2,
        }}
      >
        <FontAwesomeIcon
          icon={icon}
          color={appStyle.color_background}
          size={20}
        />
      </CustomButton>
    );
  };
  return (
    <View style={safeAreaStyle()}>
      <Header goBackOption={true} icon={"<"} title={program.name} />
      <FlatList
        keyExtractor={(item, index) => index}
        data={program.workouts}
        renderItem={({ item, index }) => (
          <CustomButton
            onPress={() =>
              index == selectedWorkoutIndex
                ? setSelectedWorkoutIndex()
                : setSelectedWorkoutIndex(index)
            }
            onLongPress={() =>
              index == selectedWorkoutIndex
                ? setSelectedWorkoutIndex()
                : setSelectedWorkoutIndex(index)
            }
            className="flex-1"
            style={[
              {
                justifyContent: "flex-start",
                borderWidth: 0.5,
                borderColor: appStyle.color_outline,
                marginHorizontal: 16,
                marginVertical: 8,
                backgroundColor: containerColor,
              },
              appComponentsDefaultStyles.shadow,
            ]}
          >
            <View className="w-full justify-between">
              <CustomText
                className="text-lg text-center font-semibold"
                style={{
                  color: appStyle.color_background,
                  backgroundColor:
                    index == selectedWorkoutIndex
                      ? disabledColor
                      : onContainerColor,
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                {item.name}
              </CustomText>
              {/* <CustomButton
                style={{
                  backgroundColor: appStyle.color_primary,
                  borderWidth: 2,
                  borderColor: appStyle.color_background,
                  borderRadius: 12,
                }}
              >
                <FontAwesomeIcon
                  icon={faPlay}
                  color={appStyle.color_background}
                />
              </CustomButton> */}
            </View>
            <View
              className="flex-row w-full "
              style={{ columnGap: 8, paddingHorizontal: 5, paddingVertical: 2 }}
            >
              <CustomText
                className={`font-semibold text-lg text-left`}
                style={{
                  width: 1,
                  flexGrow: 3,
                  color:
                    index == selectedWorkoutIndex
                      ? disabledColor
                      : onContainerColor,
                }}
              >
                {languageService[user.language].exercise}
              </CustomText>
              <CustomText
                className="text-center font-semibold text-lg"
                style={{
                  width: 1,
                  flexGrow: 1,
                  color:
                    index == selectedWorkoutIndex
                      ? disabledColor
                      : onContainerColor,
                }}
              >
                {languageService[user.language].sets}
              </CustomText>
              <CustomText
                className="text-center font-semibold text-lg"
                style={{
                  width: 1,
                  flexGrow: 1,
                  color:
                    index == selectedWorkoutIndex
                      ? disabledColor
                      : onContainerColor,
                }}
              >
                {languageService[user.language].reps}
              </CustomText>
            </View>
            <FlatList
              className="w-full"
              data={item.exercises}
              keyExtractor={(exercise, index) => index}
              renderItem={({ item }) => (
                <View
                  className="flex-row w-full"
                  style={{
                    columnGap: 8,
                    paddingHorizontal: 5,
                    paddingVertical: 4,
                    borderTopColor: disabledColor,
                    borderTopWidth: 0.3,
                  }}
                >
                  <CustomText
                    className="text-left"
                    style={{
                      width: 1,
                      flexGrow: 3,
                      color:
                        index == selectedWorkoutIndex
                          ? disabledColor
                          : onContainerColor,
                    }}
                  >
                    {item.name}
                  </CustomText>
                  <CustomText
                    className="text-center"
                    style={{
                      width: 1,
                      flexGrow: 1,
                      color:
                        index == selectedWorkoutIndex
                          ? disabledColor
                          : onContainerColor,
                    }}
                  >
                    {item.sets}
                  </CustomText>
                  <CustomText
                    className="text-center"
                    style={{
                      width: 1,
                      flexGrow: 1,
                      color:
                        index == selectedWorkoutIndex
                          ? disabledColor
                          : onContainerColor,
                    }}
                  >
                    {item.reps}
                  </CustomText>
                </View>
              )}
            />
            {index == selectedWorkoutIndex && (
              <View
                className="absolute h-full items-center justify-center flex-row"
                style={{ columnGap: 10 }}
              >
                {workoutButton(() => {
                  navigation.navigate("IntervalTimer", { workout: item });
                  setSelectedWorkoutIndex();
                }, faPlay)}
                {/* {workoutButton(() => {}, faPenAlt)} */}
              </View>
            )}
          </CustomButton>
        )}
      />
      <CustomButton
        onPress={() =>
          navigation.navigate("EditWorkoutProgram", {
            program: program,
          })
        }
        className="rounded-full aspect-square w-16 items-center justify-center absolute"
        style={[
          {
            backgroundColor: appStyle.color_tertiary,
            right: 20,
            bottom: 20,
          },
          appComponentsDefaultStyles.shadow,
        ]}
      >
        <FontAwesomeIcon
          icon={faPenAlt}
          size={25}
          color={appStyle.color_on_primary}
        />
      </CustomButton>
    </View>
  );
};

export default WorkoutProgramScreen;
