import { StyleProp, Text, TextProps, ViewStyle } from "react-native";
import React from "react";
import {
  color_on_primary,
  color_primary,
  color_secondary,
} from "../../utilities/appStyleSheet";
interface CustomTextProps extends TextProps {
  title: string;
  style?: StyleProp<ViewStyle>;
}
const CustomText: React.FC<CustomTextProps> = ({ children, style }) => {
  return <Text style={[style]}>{children}</Text>;
};

export default CustomText;
