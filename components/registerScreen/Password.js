import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import * as appStyle from "../../utils/appStyleSheet";
const Password = (props) => {
  const [passwordStyle, setPasswordStyle] = useState(props.style.input);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [passowrd, setPassowrd] = useState("");
  const handleChangedText = (text) => {
    setPassowrd(text);
    const validPassword = /^[\S]{8,20}$/.test(text);
    if (validPassword) {
      setPasswordStyle(props.style.input);
      setError(null);
      props.valueChanged(text);
    } else {
      setPasswordStyle(props.style.badInput);
      setError("8-20 characters, no white spaces");
      props.valueChanged(null);
    }
  };

  return (
    <View style={props.style.inputContainer}>
      <View>
        <TextInput
          autoComplete="off"
          secureTextEntry={!showPassword}
          style={passwordStyle}
          placeholder="Password"
          placeholderTextColor={"#5f6b8b"}
          onChangeText={(text) => handleChangedText(text)}
        ></TextInput>
        <View
          style={{
            position: "absolute",
            right: 12,
            top: 0,
            bottom: 0,
            justifyContent: "center",
          }}
        >
          {passowrd != "" && (
            <TouchableOpacity
              onPress={() => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? (
                <FontAwesomeIcon
                  icon={faEyeSlash}
                  size={25}
                  color={appStyle.color_on_surface}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faEye}
                  size={25}
                  color={appStyle.color_on_surface}
                />
              )}
            </TouchableOpacity>
          )}
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
