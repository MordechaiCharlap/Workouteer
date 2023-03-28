import { View, StatusBar } from "react-native";
import React, { useCallback } from "react";
import responsiveStyle from "../components/ResponsiveStyling";
import * as firebase from "../services/firebase";
import * as appStyle from "../components/AppStyleSheet";
import languageService from "../services/languageService";
import { doc, updateDoc } from "firebase/firestore";

const UpdateAppScreen = () => {
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
    </View>
  );
};

export default UpdateAppScreen;
