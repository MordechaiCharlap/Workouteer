import { View, Text } from "react-native";
import React from "react";
import { appDarkBlue, appGray } from "./AppStyleSheet";
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
        <Text className="text-center font-bold" style={{ color: appGray }}>
          {props.number}
        </Text>
      )}
    </View>
  );
};

export default AlertDot;
