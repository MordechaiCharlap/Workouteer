import { View, Text } from "react-native";
import React, { useCallback } from "react";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect } from "@react-navigation/native";

const ConditionsScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Conditions");
    }, [])
  );
  return (
    <View>
      <Text>ConditionsScreen</Text>
    </View>
  );
};

export default ConditionsScreen;
