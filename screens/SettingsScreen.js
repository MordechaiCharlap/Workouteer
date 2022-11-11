import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import * as appStyle from "../components/AppStyleSheet";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { useState } from "react";
import { useContext } from "react";
import authContext from "../context/authContext";
import { useEffect } from "react";
const SettingsScreen = () => {
  const { user, setUser } = useContext(authContext);
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
    if (user.isPublic != isPublic || user.showOnline != showOnline)
      setChangesMade(true);
    else setChangesMade(false);
  }, [isPublic, showOnline]);
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
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
      </View>
      <View
        style={{ backgroundColor: appStyle.appAzure }}
        className="h-16 p-2 justify-center items-center"
      >
        <TouchableOpacity className="bg-gray-100 p-1 rounded">
          <Text
            className="text-xl text-center"
            style={{ color: appStyle.appDarkBlue }}
          >
            {changesMade == false ? "No changes were made" : "Apply changes"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
