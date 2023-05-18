import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = ({ children, style, onPress, disabled }) => {
  const buttonStyle = {
    borderRadius: 4,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  };
  const merged = { ...buttonStyle, ...style };
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={merged}>
      {children}
    </TouchableOpacity>
  );
};

export default CustomButton;
