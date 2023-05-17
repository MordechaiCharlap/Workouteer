import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { color_on_primary, color_primary } from "../../utilities/appStyleSheet";

const CustomButton = ({ children, type, style, onPress, disabled }) => {
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
