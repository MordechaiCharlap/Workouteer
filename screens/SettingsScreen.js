import {
  Text,
  View,
  TouchableOpacity,
  Switch,
  StatusBar,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import * as appStyle from "../components/AppStyleSheet";
import responsiveStyle from "../components/ResponsiveStyling";
import { saveSettingsChanges } from "../services/firebase";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import languageService from "../services/languageService";
const SettingsScreen = () => {
  const { user, setUser, userSignOut } = useAuth();
  const [changesMade, setChangesMade] = useState(false);
  const [isPublic, setIsPublic] = useState(user.isPublic);
  const [showOnline, setShowOnline] = useState(user.showOnline);
  const [language, setLanguage] = useState(user.language);
  const navigation = useNavigation();
  useEffect(() => {
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
        <Header
          title={languageService[user.language].settings}
          goBackOption={true}
        />
        <Text className="text-center" style={{ color: appStyle.color_primary }}>
          {languageService[user.language].privacy}
        </Text>
        <View
          className={`justify-between items-center h-10 ${
            user.language == "hebrew" ? "flex-row-reverse" : "flex-row"
          }`}
          style={{ color: appStyle.color_primary }}
        >
          <Text style={{ color: appStyle.color_primary }}>
            {languageService[user.language].publicAccount}:
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: appStyle.color_primary }}
            thumbColor={"#f4f3f4"}
            value={isPublic}
            onValueChange={() => setIsPublic((prev) => !prev)}
          />
        </View>
        <View
          className={`justify-between items-center h-10 ${
            user.language == "hebrew" ? "flex-row-reverse" : "flex-row"
          }`}
          style={{ color: appStyle.color_primary }}
        >
          <Text style={{ color: appStyle.color_primary }}>
            {languageService[user.language].showOnlineStatus}:
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: appStyle.color_primary }}
            thumbColor={"#f4f3f4"}
            value={showOnline}
            onValueChange={() => setShowOnline((prev) => !prev)}
          />
        </View>
        <View
          className={`justify-between items-center h-10 ${
            user.language == "hebrew" ? "flex-row-reverse" : "flex-row"
          }`}
          style={{ color: appStyle.color_primary }}
        >
          <Text style={{ color: appStyle.color_primary }}>
            {languageService[user.language].chooseLanguage}:
          </Text>
          <View className="flex-row gap-x-2">
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
        <View className="flex-row items-center justify-between mt-5">
          <TouchableOpacity className="w-5/12">
            <Text
              className="text-center py-1 px-1"
              style={{
                backgroundColor: appStyle.color_primary,
                color: appStyle.color_on_primary,
              }}
            >
              {languageService[user.language].changePassword}
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
              {languageService[user.language].logOut}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="absolute bottom-8 right-0 left-0 items-center">
          <TouchableOpacity
            style={{
              backgroundColor: appStyle.color_primary,
            }}
            className="items-center rounded-xl p-3"
          >
            <FontAwesomeIcon
              color={appStyle.color_on_primary}
              icon={faBug}
              size={30}
            />
          </TouchableOpacity>
          <Text
            className="text-lg text-center font-semibold"
            style={{
              color: appStyle.color_primary,
            }}
          >
            {languageService[user.language].reportABug}
          </Text>
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
            {changesMade == false
              ? languageService[user.language].noChangesWereMade
              : languageService[user.language].applyChanges}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;
