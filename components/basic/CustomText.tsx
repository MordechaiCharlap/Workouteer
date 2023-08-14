import {
  StyleProp,
  Text,
  TextProps,
  ViewStyle,
  Platform,
  TextStyle,
} from "react-native";
import React from "react";
interface CustomTextProps extends TextProps {
  style?: StyleProp<TextStyle>;
}
const CustomText: React.FC<CustomTextProps> = ({ children, style }) => {
  return <Text style={[style]}>{children}</Text>;
};

export default CustomText;
