import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import * as appStyle from "../../utilities/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
const CustomTextInput = ({ placeholder, style, onChangeText, password }) => {
  const [text, setText] = useState("");
  const [secureText, setSecureText] = useState(password && true);
  useEffect(() => {
    onChangeText(text);
  }, [text]);
  return (
    <View>
      <TextInput
        style={[styleSheet.input, style]}
        placeholder={placeholder}
        placeholderTextColor={appStyle.color_outline}
        onChangeText={(text) => setText(text)}
        secureTextEntry={secureText}
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
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
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
          </TouchableOpacity>
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
    height: 40,
    borderWidth: 2,
    borderColor: appStyle.color_background,
    color: appStyle.color_primary,
    backgroundColor: appStyle.color_surface,
  },
});
