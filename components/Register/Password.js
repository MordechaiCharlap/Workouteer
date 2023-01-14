import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import * as appStyle from "../AppStyleSheet";
const Password = (props) => {
  const [passwordStyle, setPasswordStyle] = useState(props.style.input);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleChangedText = (text) => {
    const validPassword = /^[a-zA-Z0-9]{6,20}$/.test(text);
    if (validPassword) {
      setPasswordStyle(props.style.input);
      setError(null);
      props.valueChanged(text);
    } else {
      setPasswordStyle(props.style.badInput);
      setError("8-20 characters, must have lower,upper case and numbers");
      props.valueChanged(null);
    }
  };

  return (
    <View className="gap-1" style={props.style.inputContainer}>
      <View>
        <TextInput
          secureTextEntry={!showPassword}
          style={passwordStyle}
          placeholder="Password"
          placeholderTextColor={"#5f6b8b"}
          onChangeText={(text) => handleChangedText(text)}
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
      <Text
        style={{
          color: appStyle.color_error,
          display: error ? "flex" : "none",
        }}
      >
        {error}
      </Text>
    </View>
  );
};

export default Password;
