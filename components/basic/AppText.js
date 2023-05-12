import { Text } from "react-native";
import React from "react";
import { color_on_primary } from "../../utilities/appStyleSheet";

const AppText = (props) => {
  const textStyle = props.style;
  if (textStyle.color == null) textStyle.color = color_on_primary;
  return <Text style={textStyle}>{props.children}</Text>;
};

export default AppText;
