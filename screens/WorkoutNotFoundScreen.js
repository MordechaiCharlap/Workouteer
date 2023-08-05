import { View, Text } from "react-native";
import React, { useCallback, useEffect } from "react";
import CustomText from "../components/basic/CustomText";
import CustomButton from "../components/basic/CustomButton";
import * as appStyle from "../utils/appStyleSheet";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
import languageService from "../services/languageService";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
const WorkoutNotFoundScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("WorkoutNotFound");
    }, [])
  );
  const { user } = useAuth();
  const navigation = useNavigation();
  return (
    <View className="flex-1 justify-center items-center p-5">
      <View
        className="items-center rounded"
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: appStyle.color_surface_variant,
          rowGap: 15,
        }}
      >
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          color={appStyle.color_on_surface_variant}
          size={100}
        />
        <CustomText
          className="text-center font-semibold text-2xl"
          style={{
            color: appStyle.color_on_surface_variant,
          }}
        >
          {languageService[user.language].workoutNotFound}
        </CustomText>
        <CustomText
          className="text-center font-semibold text-lg"
          style={{
            color: appStyle.color_on_surface_variant,
          }}
        >
          {languageService[user.language].itSeemsThatItGotCancledByTheCreator}
        </CustomText>
        <CustomButton
          style={{ backgroundColor: appStyle.color_on_background }}
          round
          onPress={() => navigation.replace("Home")}
        >
          <CustomText
            className="font-semibold text-lg"
            style={{
              color: appStyle.color_background,
            }}
          >
            {languageService[user.language].goToHomePage}
          </CustomText>
        </CustomButton>
      </View>
    </View>
  );
};

export default WorkoutNotFoundScreen;
