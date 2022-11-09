import { View, Text } from "react-native";
import React from "react";
import * as appStyle from "./AppStyleSheet";
const ChatMessage = (props) => {
  return (
    <View className="rounded" style={{ backgroundColor: appStyle.appAzure }}>
      <Text className="text-xl" style={{ color: appStyle.appGray }}>
        {props.content}
      </Text>
      <Text style={{ color: appStyle.appGray }}>{props.createdAt}</Text>
    </View>
  );
};

export default ChatMessage;
