import { View, TextInput, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import * as appStyle from "../AppStyleSheet";

const Password = (props) => {
  const [passwordStyle, setPasswordStyle] = useState(props.style.input);
  return (
    <View>
      <TextInput
        className="justify-center"
        secureTextEntry={!showPassword}
        style={passwordStyle}
        placeholder="Password"
        placeholderTextColor={"#5f6b8b"}
        onChangeText={(text) => setPassword(text)}
        onBlur={passwordLostFocus}
      ></TextInput>
      <View className="absolute right-3 top-0 bottom-0 justify-center">
        <TouchableOpacity
          onPress={() => {
            setShowPassword(!showPassword);
          }}
        >
          {showPassword ? (
            <FontAwesomeIcon
              icon={faEyeSlash}
              size={25}
              color={appStyle.color_primary}
            />
          ) : (
            <FontAwesomeIcon
              icon={faEye}
              size={25}
              color={appStyle.color_primary}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Password;
