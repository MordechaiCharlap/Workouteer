import { View, Text, StatusBar } from "react-native";
import * as appStyle from "../components/AppStyleSheet";
import React from "react";

const NotificationsScreen = () => {
  return (
    <View>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
    </View>
  );
};

export default NotificationsScreen;
