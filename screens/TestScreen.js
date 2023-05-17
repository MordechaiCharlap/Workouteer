import { View, Text } from "react-native";
import React from "react";
import { safeAreaStyle } from "../components/safeAreaStyle";
import CustomTextButton from "../components/basic/CustomTextButton";
const TestScreen = () => {
  return (
    <View style={safeAreaStyle()}>
      <CustomTextButton type="primary">TEST</CustomTextButton>
    </View>
  );
};

export default TestScreen;
