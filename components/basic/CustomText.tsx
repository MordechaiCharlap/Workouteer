import { StyleProp, Text, TextProps, ViewStyle } from "react-native";
import React from "react";
interface CustomTextProps extends TextProps {
  title: string;
  style?: StyleProp<ViewStyle>;
}
const CustomText: React.FC<CustomTextProps> = ({ children, style }) => {
  return <Text style={[style]}>{children}</Text>;
};

export default CustomText;
