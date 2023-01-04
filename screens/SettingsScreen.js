import { Text, View, TouchableOpacity, Switch, StatusBar } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import * as appStyle from "../components/AppStyleSheet";
import responsiveStyle from "../components/ResponsiveStyling";
import { saveSettingsChanges, updateContext } from "../services/firebase";
import useAuth from "../hooks/useAuth";
const SettingsScreen = () => {
  const { user, setUser, userSignOut } = useAuth();
  const [changesMade, setChangesMade] = useState(false);
  const [isPublic, setIsPublic] = useState(user.isPublic);
  const [showOnline, setShowOnline] = useState(user.showOnline);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    console.log("useEffecting settings");
    if (user.isPublic != isPublic || user.showOnline != showOnline)
      setChangesMade(true);
    else setChangesMade(false);
  }, [isPublic, showOnline]);
  const applyChanges = async () => {
    if (changesMade) {
      await saveSettingsChanges(user.usernameLower, isPublic, showOnline);
      setUser(await updateContext(user.usernameLower));
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
        <Text
          className="text-center text-2xl"
          style={{ color: appStyle.appGray }}
        >
          Settings
        </Text>
        <Text className="text-center" style={{ color: appStyle.appGray }}>
          Privacy
        </Text>
        <View
          className="flex-row justify-between items-center"
          style={{ color: appStyle.appGray }}
        >
          <Text style={{ color: appStyle.appGray }}>Public account:</Text>
          <Switch
            value={isPublic}
            onValueChange={() => setIsPublic((prev) => !prev)}
          />
        </View>
        <View
          className="flex-row justify-between items-center"
          style={{ color: appStyle.appGray }}
        >
          <Text style={{ color: appStyle.appGray }}>Online status:</Text>
          <Switch
            value={showOnline}
            onValueChange={() => setShowOnline((prev) => !prev)}
          />
        </View>
        <View className="flex-row items-center justify-around">
          <TouchableOpacity className="w-5/12">
            <Text
              className="text-center py-1 px-1"
              style={{
                backgroundColor: appStyle.appAzure,
                color: appStyle.appDarkBlue,
              }}
            >
              Change password
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => userSignOut()} className="w-5/12">
            <Text
              className="text-center py-1 px-1"
              style={{
                backgroundColor: appStyle.appAzure,
                color: appStyle.appDarkBlue,
              }}
            >
              Log out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{ backgroundColor: appStyle.appAzure }}
        className="h-16 p-2 justify-center items-center"
      >
        <TouchableOpacity
          onPress={applyChanges}
          className="bg-gray-100 p-1 rounded"
        >
          <Text
            className="text-xl text-center"
            style={{ color: appStyle.appDarkBlue }}
          >
            {changesMade == false ? "No changes were made" : "Apply changes"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;
