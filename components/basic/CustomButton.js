import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = ({ children, style, onPress, disabled }) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        {
          borderRadius: 4,
          paddingHorizontal: 12,
          paddingVertical: 8,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      {children}
    </TouchableOpacity>
  );
};

export default CustomButton;
