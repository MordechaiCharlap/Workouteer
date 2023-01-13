import { TextInput } from "react-native";
import React, { useState } from "react";

const EmailInput = (props) => {
  const [email, setEmail] = useState();
  const [emailStyle, setEmailStyle] = useState(props.style.input);

  const emailLostFocus = () => {
    var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(validRegex)) {
      console.log("good email");
      setEmailStyle(props.style.input);
    } else {
      setEmailStyle(props.style.badInput);
    }
  };

  return (
    <TextInput
      onBlur={emailLostFocus}
      className="justify-center mb-5"
      style={emailStyle}
      placeholder="Email"
      placeholderTextColor={"#5f6b8b"}
      onChangeText={(text) => setEmail(text)}
    ></TextInput>
  );
};

export default EmailInput;
