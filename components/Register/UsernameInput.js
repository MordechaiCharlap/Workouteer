import { TextInput } from "react-native";
import React from "react";

const UsernameInput = (props) => {
  const [usernameStyle, setUsernameStyle] = useState(props.style.input);

  const isRegexUsername = (text) => {
    var validRegex = /^[a-zA-Z0-9]{6,20}$/;
    if (text.match(validRegex)) {
      return true;
    } else return false;
  };

  const usernameLostFocus = () => {
    if (isRegexUsername(username)) {
      setUsernameStyle(props.style.input);
    } else {
      setUsernameStyle(props.style.badInput);
    }
  };
  return (
    <TextInput
      onBlur={usernameLostFocus}
      className="justify-center mb-5"
      style={usernameStyle}
      placeholder="Username (6+ English characters/numbers)"
      placeholderTextColor={"#5f6b8b"}
      onChangeText={(text) => setUsername(text)}
    ></TextInput>
  );
};

export default UsernameInput;
