import {
  Text,
  View,
  TouchableOpacity,
  Switch,
  StatusBar,
  Modal,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import * as appStyle from "../components/AppStyleSheet";
import responsiveStyle from "../components/ResponsiveStyling";
import { saveSettingsChanges, updateContext } from "../services/firebase";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
const SettingsScreen = () => {
  const { user, setUser, userSignOut } = useAuth();
  const [changesMade, setChangesMade] = useState(false);
  const [isPublic, setIsPublic] = useState(user.isPublic);
  const [showOnline, setShowOnline] = useState(user.showOnline);
  const [language, setLanguage] = useState(user.language);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    console.log("useEffecting settings");
    if (
      user.isPublic != isPublic ||
      user.showOnline != showOnline ||
      language != user.language
    ) {
      setChangesMade(true);
    } else {
      setChangesMade(false);
    }
  }, [isPublic, showOnline, language]);
  const applyChanges = async () => {
    if (changesMade) {
      await saveSettingsChanges(user.id, isPublic, showOnline, language);
      setUser(await updateContext(user.id));
      navigation.goBack();
    }
  };
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View className="flex-1 p-4">
        <Header title={"Settings"} goBackOption={true} />
        <Text className="text-center" style={{ color: appStyle.color_primary }}>
          Privacy
        </Text>
        <View
          className="flex-row justify-between items-center h-10"
          style={{ color: appStyle.color_primary }}
        >
          <Text style={{ color: appStyle.color_primary }}>Public account:</Text>
          <Switch
            trackColor={{ false: "#767577", true: appStyle.color_primary }}
            thumbColor={"#f4f3f4"}
            value={isPublic}
            onValueChange={() => setIsPublic((prev) => !prev)}
          />
        </View>
        <View
          className="flex-row justify-between items-center h-10"
          style={{ color: appStyle.color_primary }}
        >
          <Text style={{ color: appStyle.color_primary }}>Online status:</Text>
          <Switch
            trackColor={{ false: "#767577", true: appStyle.color_primary }}
            thumbColor={"#f4f3f4"}
            value={showOnline}
            onValueChange={() => setShowOnline((prev) => !prev)}
          />
        </View>
        <View
          className="flex-row justify-between items-center h-10"
          style={{ color: appStyle.color_primary }}
        >
          <Text style={{ color: appStyle.color_primary }}>
            Choose language:
          </Text>
          <View className="flex-row gap-2">
            <TouchableOpacity
              disabled={language == "hebrew"}
              onPress={() => setLanguage("hebrew")}
              style={{
                backgroundColor:
                  language == "hebrew"
                    ? appStyle.color_lighter
                    : appStyle.color_primary,
              }}
              className="py-1 px-2"
            >
              <Text
                style={{
                  color:
                    language == "hebrew" ? "gray" : appStyle.color_on_primary,
                }}
              >
                עברית
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={language == "english"}
              onPress={() => setLanguage("english")}
              style={{
                backgroundColor:
                  language == "english"
                    ? appStyle.color_lighter
                    : appStyle.color_primary,
              }}
              className="py-1 px-2"
            >
              <Text
                style={{
                  color:
                    language == "english" ? "gray" : appStyle.color_on_primary,
                }}
              >
                English
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-row items-center justify-around mt-5">
          <TouchableOpacity className="w-5/12">
            <Text
              className="text-center py-1 px-1"
              style={{
                backgroundColor: appStyle.color_primary,
                color: appStyle.color_on_primary,
              }}
            >
              Change password
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={userSignOut} className="w-5/12">
            <Text
              className="text-center py-1 px-1"
              style={{
                backgroundColor: appStyle.color_primary,
                color: appStyle.color_on_primary,
              }}
            >
              Log out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{ backgroundColor: appStyle.color_primary }}
        className="h-16 p-2 justify-center items-center"
      >
        <TouchableOpacity
          onPress={applyChanges}
          className="bg-gray-100 p-1 rounded"
        >
          <Text
            className="text-xl text-center"
            style={{ color: appStyle.color_primary }}
          >
            {changesMade == false ? "No changes were made" : "Apply changes"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;
