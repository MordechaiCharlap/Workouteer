import React, { useCallback } from "react";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StatusBar } from "react-native";
import * as appStyle from "../utilities/appStyleSheet";
import { safeAreaStyle } from "../components/safeAreaStyle";

const TermsOfServiceScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("TermsOfService");
    }, [])
  );
  return (
    <View style={safeAreaStyle()}>
      <Text>TermsOfServiceScreen</Text>
    </View>
  );
};

export default TermsOfServiceScreen;
