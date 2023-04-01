import { View, StatusBar, Text, TouchableOpacity } from "react-native";
import React, { useCallback } from "react";
import responsiveStyle from "../components/ResponsiveStyling";
import * as firebase from "../services/firebase";
import * as appStyle from "../components/AppStyleSheet";
import languageService from "../services/languageService";
import useAuth from "../hooks/useAuth";
const UpdateAppScreen = () => {
  const { user } = useAuth();
  return (
    <View className="justify-center" style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View
        className="rounded-lg p-2 self-center w-11/12"
        style={{ backgroundColor: appStyle.color_primary }}
      >
        <Text
          className="text-2xl text-center"
          style={{ color: appStyle.color_on_primary }}
        >
          {user
            ? languageService[user.language].updateAppToUseIt
            : "There is a new version of the app available for download. to make sure you don't run into bugs - download the latest version"}
        </Text>
        <View className="flex-row gap-x-2">
          <TouchableOpacity
            className="flex-1 rounded py-1"
            style={{ backgroundColor: appStyle.color_bg }}
          >
            <Text
              className="text-2xl text-center font-semibold"
              style={{ color: appStyle.color_primary }}
            >
              {user ? languageService[user.language].update : "Ipdate"}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            className="flex-1 rounded py-1"
            style={{ backgroundColor: appStyle.color_bg }}
          >
            <Text
              className="text-2xl text-center"
              style={{ color: appStyle.color_primary }}
            >
              {languageService[user.language].leave}
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
};

export default UpdateAppScreen;