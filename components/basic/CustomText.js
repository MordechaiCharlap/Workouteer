import { Text } from "react-native";
import React from "react";
import {
  color_on_primary,
  color_primary,
  color_secondary,
} from "../../utilities/appStyleSheet";

const CustomText = ({ children, type }) => {
  return (
    <Text
      style={{ color: type == "primary" ? color_primary : color_on_primary }}
    >
      {children}
    </Text>
  );
};

export default CustomText;
