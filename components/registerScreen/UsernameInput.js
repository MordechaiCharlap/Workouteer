import { TextInput, View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import * as appStyle from "../../utils/appStyleSheet";
const UsernameInput = (props) => {
  const [usernameStyle, setUsernameStyle] = useState(props.style.input);
  const [error, setError] = useState(null);

  const changedTextHandler = (text) => {
    const validUsername = /^[a-zA-Z0-9]{6,20}$/.test(text);
    if (validUsername) {
      setUsernameStyle(props.style.input);
      setError(null);
      props.valueChanged(text);
    } else {
      setUsernameStyle(props.style.badInput);
      setError("English/numbers, 6-20 characters");
      props.valueChanged(null);
    }
  };
  return (
    <View style={props.style.inputContainer}>
      <TextInput
        style={usernameStyle}
        placeholder="Username"
        placeholderTextColor={"#5f6b8b"}
        onChangeText={(text) => changedTextHandler(text)}
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

export default UsernameInput;
