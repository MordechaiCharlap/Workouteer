import { View, Text } from "react-native";
import React from "react";
const AlertDot = (props) => {
  return (
    <View
      className="rounded-full justify-center"
      style={{
        width: props.size,
        height: props.size,
        backgroundColor: props.color,
        borderWidth: props.borderWidth,
        borderColor: props.borderColor,
      }}
    >
      {props.number != null && (
        <Text
          className="text-center"
          style={{ color: props.numberColor, fontSize: props.fontSize }}
        >
          {props.number}
        </Text>
      )}
    </View>
  );
};

export default AlertDot;
