import { TextInput, View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import * as appStyle from "../../utilites/appStyleSheet";

const EmailInput = (props) => {
  const [emailStyle, setEmailStyle] = useState(props.style.input);
  const [error, setError] = useState(null);
  const handleChangdText = (text) => {
    const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      text
    );
    if (validEmail) {
      setEmailStyle(props.style.input);
      setError(null);
      props.valueChanged(text);
    } else {
      setEmailStyle(props.style.badInput);
      setError("Not a valid email");
      props.valueChanged(null);
    }
  };

  return (
    <View style={props.style.inputContainer}>
      <TextInput
        style={emailStyle}
        placeholder="Email"
        placeholderTextColor={"#5f6b8b"}
        onChangeText={(text) => handleChangdText(text)}
      ></TextInput>
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

export default EmailInput;
