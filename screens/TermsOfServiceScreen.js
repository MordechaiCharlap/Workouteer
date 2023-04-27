import { View, Text } from "react-native";
import React, { useCallback } from "react";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect } from "@react-navigation/native";

const TermsOfServiceScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("TermsOfService");
    }, [])
  );
  return (
    <View>
      <Text>TermsOfServiceScreen</Text>
    </View>
  );
};

export default TermsOfServiceScreen;
