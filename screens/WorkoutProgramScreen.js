import { View, Text, FlatList, TouchableOpacity } from "react-native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as appStyle from "../utils/appStyleSheet";
import CustomText from "../components/basic/CustomText";
import CustomButton from "../components/basic/CustomButton";
import { safeAreaStyle } from "../components/safeAreaStyle";
import useAuth from "../hooks/useAuth";
import useFirebase from "../hooks/useFirebase";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPenAlt, faPlay } from "@fortawesome/free-solid-svg-icons";
import appComponentsDefaultStyles from "../utils/appComponentsDefaultStyles";
import languageService from "../services/languageService";
const WorkoutProgramScreen = ({ route }) => {
  const { setCurrentScreen } = useNavbarDisplay();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { db } = useFirebase();
  const program = route.params.program;
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("WorkoutProgram");
    }, [])
  );
  const onContainerColor = appStyle.color_primary_container;
  const containerColor = appStyle.color_on_primary_container;
  return (
    <View style={safeAreaStyle()}>
      <Header goBackOption={true} icon={"<"} title={program.name} />
      <FlatList
        keyExtractor={(item, index) => index}
        data={program.workouts}
        style={{ marginHorizontal: 16 }}
        renderItem={({ item }) => (
          <CustomButton
            style={{
              marginBottom: 10,
              backgroundColor: appStyle.color_primary_container,
            }}
          >
            <View className="flex-row w-full justify-between items-center">
              <CustomText
                style={{
                  fontWeight: 600,
                  fontSize: 30,
                  color: appStyle.color_on_background,
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
              className="flex-row w-full"
              style={{ columnGap: 8, padding: 5 }}
            >
              <CustomText
                style={{ width: 1, flexGrow: 3, color: containerColor }}
              >
                {languageService[user.language].name}
              </CustomText>
              <CustomText
                className="text-center"
                style={{ width: 1, flexGrow: 1, color: containerColor }}
              >
                {languageService[user.language].sets}
              </CustomText>
              <CustomText
                className="text-center"
                style={{ width: 1, flexGrow: 1, color: containerColor }}
              >
                {languageService[user.language].reps}
              </CustomText>
            </View>
            <FlatList
              className="w-full mt-1"
              data={item.exercises}
              keyExtractor={(exercise, index) => index}
              renderItem={({ item }) => (
                <View
                  className="flex-row w-full"
                  style={{ columnGap: 8, padding: 5 }}
                >
                  <CustomText
                    className="text-left"
                    style={{ width: 1, flexGrow: 3, color: containerColor }}
                  >
                    {item.name}
                  </CustomText>
                  <CustomText
                    className="text-center"
                    style={{ width: 1, flexGrow: 1, color: containerColor }}
                  >
                    {item.sets}
                  </CustomText>
                  <CustomText
                    className="text-center"
                    style={{ width: 1, flexGrow: 1, color: containerColor }}
                  >
                    {item.reps}
                  </CustomText>
                </View>
              )}
            />
          </CustomButton>
        )}
      />
      {/* <CustomButton
        className="rounded-full aspect-square w-12 items-center justify-center absolute"
        style={{
          elevation: 4,
          backgroundColor: appStyle.color_tertiary,
          right: 20,
          bottom: 20,
        }}
      >
        <FontAwesomeIcon
          icon={faPenAlt}
          size={25}
          color={appStyle.color_on_primary}
        />
      </CustomButton> */}
    </View>
  );
};

export default WorkoutProgramScreen;
