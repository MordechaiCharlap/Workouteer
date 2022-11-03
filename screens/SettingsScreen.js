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
import CheckBox from "../components/CheckBox";
import { useState } from "react";
import { useContext } from "react";
import authContext from "../context/authContext";
const SettingsScreen = () => {
  const { user, setUser } = useContext(authContext);
  const [isPublic, setIsPublic] = useState(user.isPublic);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1">
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
          <Switch value={false} />
        </View>
        <View
          className="flex-row justify-between items-center"
          style={{ color: appStyle.appGray }}
        >
          <Text style={{ color: appStyle.appGray }}>Online status:</Text>
          <Switch value={false} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
