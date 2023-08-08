import { View, Text } from "react-native";
import React from "react";
const AlertDot = ({
  size,
  color,
  borderWidth,
  borderColor,
  text,
  fontSize,
  textColor,
}) => {
  return (
    <View
      className="rounded-full justify-center items-center"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderWidth: borderWidth,
        borderColor: borderColor,
      }}
    >
      {text != null && (
        <Text
          className="text-center"
          style={[{ color: textColor }, fontSize && { fontSize: fontSize }]}
        >
          {Number.isInteger(text) && text > 99 ? "99+" : text}
        </Text>
      )}
    </View>
  );
};

export default AlertDot;
