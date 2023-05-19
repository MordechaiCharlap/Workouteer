import {
  StyleSheet,
  TextInput,
  View,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as appStyle from "../../utilities/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import CustomButton from "./CustomButton";
interface CustomTextInputProps extends TextInputProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  password: boolean;
}
const CustomTextInput: React.FC<CustomTextInputProps> = ({
  placeholder,
  style,
  onChangeText,
  password,
  ...restProps
}) => {
  const [text, setText] = useState("");
  const [secureText, setSecureText] = useState(password && true);
  useEffect(() => {
    if (onChangeText) {
      onChangeText(text);
    }
  }, [text, onChangeText]);
  return !password ? (
    <TextInput
      style={[styleSheet.input, style]}
      placeholder={placeholder}
      placeholderTextColor={appStyle.color_outline}
      onChangeText={(text) => setText(text)}
      secureTextEntry={secureText}
      {...restProps}
    />
  ) : (
    <View>
      <TextInput
        style={[styleSheet.input, style]}
        placeholder={placeholder}
        placeholderTextColor={appStyle.color_outline}
        onChangeText={(text) => setText(text)}
        secureTextEntry={secureText}
        {...restProps}
      />
      {password && text != "" && (
        <View
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            top: 0,
            justifyContent: "center",
            marginHorizontal: 8,
          }}
        >
          <CustomButton onPress={() => setSecureText(!secureText)}>
            {secureText ? (
              <FontAwesomeIcon
                icon={faEye}
                color={appStyle.color_on_surface}
                size={25}
              />
            ) : (
              <FontAwesomeIcon
                icon={faEyeSlash}
                color={appStyle.color_on_surface}
                size={25}
              />
            )}
          </CustomButton>
        </View>
      )}
    </View>
  );
};

export default CustomTextInput;
const styleSheet = StyleSheet.create({
  input: {
    borderRadius: 4,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: appStyle.color_outline,
    color: appStyle.color_on_surface,
    backgroundColor: appStyle.color_surface,
  },
});
