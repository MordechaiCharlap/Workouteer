import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import appComponentsDefaultStyles from "../../utilities/appComponentsDefaultStyles";

const CustomButton = ({ children, style, onPress, disabled }) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{ ...appComponentsDefaultStyles.button, ...style }}
    >
      {children}
    </TouchableOpacity>
  );
};

export default CustomButton;
