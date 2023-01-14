import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import * as appStyle from "../AppStyleSheet";

const ConfirmPassword = (props) => {
  const [confirmPasswordStyle, setConfirmPasswordStyle] = useState(
    props.style.input
  );
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleChangdText = (text) => {
    if (props.password != null) {
      if (text == props.password) {
        setConfirmPasswordStyle(props.style.input);
        setError(null);
        props.valueChanged(true);
      } else {
        setConfirmPasswordStyle(props.style.badInput);
        setError("Text doesn't match your initial password");
        props.valueChanged(null);
      }
    } else {
      setError("Fill out the first password and then come back");
    }
  };

  return (
    <View className="gap-1" style={props.style.inputContainer}>
      <View>
        <TextInput
          secureTextEntry={!showConfirmPassword}
          style={confirmPasswordStyle}
          placeholder="Confirm Password"
          placeholderTextColor={"#5f6b8b"}
          onChangeText={(text) => {
            handleChangdText(text);
          }}
        ></TextInput>

        <View className="absolute right-3 top-0 bottom-0 justify-center">
          <TouchableOpacity
            onPress={() => {
              setShowConfirmPassword(!showConfirmPassword);
            }}
          >
            {showConfirmPassword ? (
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

export default ConfirmPassword;
