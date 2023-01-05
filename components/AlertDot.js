import { View } from "react-native";
import React from "react";
const AlertDot = (props) => {
  return (
    <View
      className="rounded-full"
      style={{
        width: props.size,
        height: props.size,
        backgroundColor: props.color,
        borderWidth: props.borderWidth,
        borderColor: props.borderColor,
      }}
    ></View>
  );
};

export default AlertDot;
