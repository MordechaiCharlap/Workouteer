import { Text } from "react-native";
import React from "react";
import {
  color_on_primary,
  color_primary,
  color_secondary,
} from "../../utilities/appStyleSheet";

const CustomText = ({ children, style }) => {
  return <Text style={[style]}>{children}</Text>;
};

export default CustomText;
