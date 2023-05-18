import { TouchableOpacity, Text, View } from "react-native";
import React from "react";
import * as appStyle from "../../utilities/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import CustomButton from "../basic/CustomButton";
import CustomText from "../basic/CustomText";
const UserDetailsButton = ({
  specialButton,
  onPress,
  text,
  icon,
  smallIcon,
  buttonStyle,
  color,
  iconColor,
}) => {
  const buttonProps = buttonStyle;
  return (
    <CustomButton style={buttonProps} onPress={() => onPress()}>
      <CustomText style={{ fontSize: 25, color: color }}>{text}</CustomText>
      <View style={{ width: 10 }}></View>
      <View>
        <FontAwesomeIcon icon={icon} size={30} color={iconColor} />
        {smallIcon && (
          <View
            className="absolute rounded-full right-0 bottom-0 items-center justify-center"
            style={{
              borderWidth: 1.5,
              borderColor: buttonProps.backgroundColor,
              backgroundColor: buttonProps.backgroundColor,
            }}
          >
            <FontAwesomeIcon icon={smallIcon} size={10} color={iconColor} />
          </View>
        )}
      </View>
    </CustomButton>
  );
};

export default UserDetailsButton;
