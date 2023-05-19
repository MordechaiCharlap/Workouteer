import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from "react-native";
import React from "react";
import appComponentsDefaultStyles from "../../utilities/appComponentsDefaultStyles";

interface CustomButtonProps extends TouchableOpacityProps {
  style?: StyleProp<ViewStyle>;
  round?: true;
}
const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  style,
  round,
  ...restProps
}) => {
  const anotherStyleProp = round
    ? { borderRadius: 999, paddingHorizontal: 12 }
    : {};
  const merged = StyleSheet.compose(style, anotherStyleProp);
  return (
    <TouchableOpacity
      style={[appComponentsDefaultStyles.button, merged]}
      {...restProps}
    >
      {children}
    </TouchableOpacity>
  );
};

export default CustomButton;
