import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from "react-native";
import React from "react";
import appComponentsDefaultStyles from "../../utils/appComponentsDefaultStyles";

interface CustomButtonProps extends TouchableOpacityProps {
  style?: StyleProp<ViewStyle>;
  round?: true;
  outline?: true;
}
const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  style,
  round,
  outline,
  ...restProps
}) => {
  var styleToMerge = {};
  if (round)
    styleToMerge = {
      ...styleToMerge,
      ...appComponentsDefaultStyles.round,
    };
  if (outline)
    styleToMerge = {
      ...styleToMerge,
      ...appComponentsDefaultStyles.outline,
    };
  const merged = StyleSheet.compose(style, styleToMerge);
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
