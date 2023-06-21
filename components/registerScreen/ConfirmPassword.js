import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import * as appStyle from "../../utils/appStyleSheet";

const ConfirmPassword = (props) => {
  const [confirmPasswordStyle, setConfirmPasswordStyle] = useState(
    props.style.input
  );
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleChangdText = (text) => {
    setConfirmPassword(text);
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
      setConfirmPasswordStyle(props.style.badInput);
      setError("Fill out the first password and then come back");
    }
  };

  return (
    <View style={props.style.inputContainer}>
      <View>
        <TextInput
          autoComplete="off"
          secureTextEntry={!showConfirmPassword}
          style={confirmPasswordStyle}
          placeholder="Confirm Password"
          placeholderTextColor={"#5f6b8b"}
          onChangeText={(text) => {
            handleChangdText(text);
          }}
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
          {confirmPassword != "" && (
            <TouchableOpacity
              onPress={() => {
                setShowConfirmPassword(!showConfirmPassword);
              }}
            >
              {showConfirmPassword ? (
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

export default ConfirmPassword;
