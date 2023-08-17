import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
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
import {
  faPenAlt,
  faPlay,
  faUserMinus,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import appComponentsDefaultStyles from "../utils/appComponentsDefaultStyles";
import languageService from "../services/languageService";
import { convertHexToRgba } from "../utils/stylingFunctions";
import {
  arrayRemove,
  arrayUnion,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import useFirebase from "../hooks/useFirebase";
const WorkoutProgramScreen = ({ route }) => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();
  const { user } = useAuth();
  const { db } = useFirebase();
  const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const program = route.params.program;
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("WorkoutProgram");
    }, [])
  );
  const onContainerColor = appStyle.color_on_primary_container;
  const containerColor = appStyle.color_surface_variant;
  const disabledColor = convertHexToRgba(onContainerColor, 0.3);
  const stopFollow = () => {
    setIsLoadingButton(true);
    updateDoc(doc(db, "workoutPrograms", program.id), {
      currentUsersCount: increment(-1),
    });
    updateDoc(doc(db, "users", user.id), {
      savedWorkoutPrograms: arrayRemove(program.id),
    }).then(() => setIsLoadingButton(false));
  };
  const follow = () => {
    setIsLoadingButton(true);
    updateDoc(doc(db, "workoutPrograms", program.id), {
      currentUsersCount: increment(1),
    });
    updateDoc(doc(db, "users", user.id), {
      savedWorkoutPrograms: arrayUnion(program.id),
    }).then(() => setIsLoadingButton(false));
  };
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
  const renderBottomButton = () => {
    if (user.id == program.creator)
      return (
        <CustomButton
          onPress={() =>
            navigation.navigate("EditWorkoutProgram", {
              program: program,
            })
          }
          style={[
            {
              marginVertical: 8,
              marginHorizontal: 16,
              paddingVertical: 16,
              backgroundColor: appStyle.color_tertiary,
            },
            appComponentsDefaultStyles.shadow,
          ]}
        >
          {isLoadingButton ? (
            <View
              className="flex-row items-center"
              style={{
                columnGap: 5,
              }}
            >
              <ActivityIndicator
                color={appStyle.color_on_primary}
                size={"small"}
              />
              <CustomText
                className="text-xl"
                style={{ color: appStyle.color_on_primary }}
              >
                {languageService[user.language].loading + "..."}
              </CustomText>
            </View>
          ) : (
            <View
              className="flex-row items-center"
              style={{
                columnGap: 5,
              }}
            >
              <FontAwesomeIcon
                icon={faPenAlt}
                size={25}
                color={appStyle.color_on_primary}
              />
              <CustomText
                className="text-xl"
                style={{ color: appStyle.color_on_primary }}
              >
                {languageService[user.language].editProgram}
              </CustomText>
            </View>
          )}
        </CustomButton>
      );
    if (user.savedWorkoutPrograms.includes(program.id))
      return (
        <CustomButton
          onPress={stopFollow}
          style={[
            {
              marginVertical: 8,
              marginHorizontal: 16,
              paddingVertical: 16,
              backgroundColor: appStyle.color_error,
            },
            appComponentsDefaultStyles.shadow,
          ]}
        >
          {isLoadingButton ? (
            <View
              className="flex-row items-center"
              style={{
                columnGap: 5,
              }}
            >
              <ActivityIndicator
                color={appStyle.color_on_primary}
                size={"small"}
              />
              <CustomText
                className="text-xl"
                style={{ color: appStyle.color_on_primary }}
              >
                {languageService[user.language].loading + "..."}
              </CustomText>
            </View>
          ) : (
            <View
              className="flex-row items-center"
              style={{
                columnGap: 5,
              }}
            >
              <FontAwesomeIcon
                icon={faUserMinus}
                size={25}
                color={appStyle.color_on_primary}
              />
              <CustomText
                className="text-xl"
                style={{ color: appStyle.color_on_primary }}
              >
                {languageService[user.language].stopFollow[user.isMale ? 1 : 0]}
              </CustomText>
            </View>
          )}
        </CustomButton>
      );
    return (
      <CustomButton
        onPress={follow}
        style={[
          {
            marginVertical: 8,
            marginHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: appStyle.color_success,
          },
          appComponentsDefaultStyles.shadow,
        ]}
      >
        <View
          className="flex-row items-center"
          style={{
            columnGap: 5,
          }}
        >
          <FontAwesomeIcon
            icon={faUserPlus}
            size={25}
            color={appStyle.color_on_primary}
          />
          <CustomText
            className="text-xl"
            style={{ color: appStyle.color_on_primary }}
          >
            {languageService[user.language].saveProgram}
          </CustomText>
        </View>
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
              className="w-full flex-1"
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
              </View>
            )}
          </CustomButton>
        )}
      />
      {renderBottomButton()}
    </View>
  );
};

export default WorkoutProgramScreen;
