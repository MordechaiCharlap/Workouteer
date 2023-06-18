import { View, Text } from "react-native";
import React from "react";
const AlertDot = (props) => {
  return (
    <View
      className="rounded-full justify-center items-center"
      style={{
        width: props.size,
        height: props.size,
        backgroundColor: props.color,
        borderWidth: props.borderWidth,
        borderColor: props.borderColor,
      }}
    >
      {props.text != null && (
        <Text
          className="text-center"
          style={{ color: props.textColor, fontSize: props.fontSize }}
        >
          {props.text}
        </Text>
      )}
    </View>
  );
};

export default AlertDot;
