import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { color_on_primary, color_primary } from "../../utilities/appStyleSheet";

const CustomButton = ({ children, type, style, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          borderRadius: 4,
          paddingHorizontal: 12,
          paddingVertical: 8,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: type == "primary" ? color_primary : color_on_primary,
        },
        style,
      ]}
    >
      {children}
    </TouchableOpacity>
  );
};

export default CustomButton;
