import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import React from "react";
import appComponentsDefaultStyles from "../../utilities/appComponentsDefaultStyles";

interface CustomButtonProps extends TouchableOpacityProps {
  style?: StyleProp<ViewStyle>;
}
const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  style,
  onPress,
  disabled,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[appComponentsDefaultStyles.button, style]}
    >
      {children}
    </TouchableOpacity>
  );
};

export default CustomButton;
