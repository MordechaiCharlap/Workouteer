import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../components/AppStyleSheet";
import { useState } from "react";
import { useContext } from "react";
import authContext from "../context/authContext";
const EditDataScreen = () => {
  const { user, setUser } = useContext(authContext);
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState("ProfileData");
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const renderChosenSection = () => {
    if (currentTab == "ProfileData")
      return (
        <View>
          <View className="items-center">
            <View>
              <Image
                source={{
                  uri: user.img,
                }}
                className="h-32 w-32 bg-white rounded-full mb-2"
              />
              <TouchableOpacity
                className="absolute right-0 bottom-0 rounded-full p-2"
                style={{
                  backgroundColor: appStyle.appGray,
                  borderWidth: 1,
                  borderColor: appStyle.appDarkBlue,
                }}
              >
                <FontAwesomeIcon
                  icon={faPen}
                  size={20}
                  color={appStyle.appDarkBlue}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    else return <View></View>;
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1  p-3">
        <View className="flex-row justify-around mb-8">
          <TouchableOpacity
            onPress={() => setCurrentTab("ProfileData")}
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
            onPress={() => setCurrentTab("WorkoutPreferences")}
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
        {renderChosenSection()}
      </View>
    </SafeAreaView>
  );
};
export default EditDataScreen;
