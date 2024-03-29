import { View, Text, TouchableOpacity, Linking } from "react-native";
import React, { useCallback } from "react";
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as appStyle from "../utils/appStyleSheet";
import languageService from "../services/languageService";
import useAuth from "../hooks/useAuth";
import { useFocusEffect } from "@react-navigation/native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
const UpdateAppScreen = () => {
  const { user } = useAuth();
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("UpdateApp");
    }, [])
  );
  return (
    <View
      className="justify-center items-center gap-y-4 px-4"
      style={safeAreaStyle()}
    >
      <View
        className="rounded-lg p-2 self-center w-11/12"
        style={{
          backgroundColor: appStyle.color_surface,
          borderWidth: 0.5,
          borderColor: appStyle.color_outline,
        }}
      >
        <Text
          className="text-2xl text-center"
          style={{ color: appStyle.color_on_surface }}
        >
          {user
            ? languageService[user.language].updateAppToUseIt
            : "There is a new version of the app available for download. to make sure you don't run into bugs - download the latest version"}
        </Text>
        <View className="flex-row gap-x-2 mt-3">
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://play.google.com/store/apps/details?id=com.charlap.workouteer"
              )
            }
            className="flex-1 rounded py-1"
            style={{ backgroundColor: appStyle.color_tertiary }}
          >
            <Text
              className="text-2xl text-center font-semibold"
              style={{ color: appStyle.color_on_tertiary }}
            >
              {user ? languageService[user.language].update : "Update"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default UpdateAppScreen;
