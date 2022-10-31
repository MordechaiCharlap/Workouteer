import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../components/AppStyleSheet";
import { useState } from "react";
const EditDataScreen = () => {
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState("ProfileData");
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1  p-3">
        <View className="flex-row justify-around">
          <TouchableOpacity
            className="w-1/2"
            style={{
              backgroundColor:
                currentTab == "ProfileData"
                  ? appStyle.appDarkBlue
                  : appStyle.appLightBlue,
            }}
          >
            <Text
              className="text-lg text-center"
              style={{
                color:
                  currentTab == "ProfileData"
                    ? appStyle.appGray
                    : appStyle.appDarkBlue,
              }}
            >
              Profile data
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-1/2"
            style={{
              backgroundColor:
                currentTab == "WorkoutPreferences"
                  ? appStyle.appDarkBlue
                  : appStyle.appLightBlue,
            }}
          >
            <Text
              className="text-lg text-center"
              style={{
                color:
                  currentTab == "WorkoutPreferences"
                    ? appStyle.appGray
                    : appStyle.appDarkBlue,
              }}
            >
              Workout preferences
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        className="absolute right-0 bottom-0 rounded-full p-2"
        style={{
          backgroundColor: appStyle.appGray,
          borderWidth: 1,
          borderColor: appStyle.appDarkBlue,
        }}
      >
        <FontAwesomeIcon icon={faPen} size={20} color={appStyle.appDarkBlue} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default EditDataScreen;
