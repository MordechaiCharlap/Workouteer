import { View, Text } from "react-native";
import React from "react";
import * as appStyle from "./AppStyleSheet";
const ChatMessage = (props) => {
  const isSelfMessage = props.sender == props.user.usernameLower;
  return (
    <View
      className="rounded w-10/12"
      style={{
        backgroundColor: isSelfMessage ? appStyle.appAzure : appStyle.appGray,
      }}
    >
      <Text
        className="text-xl"
        style={{
          color: isSelfMessage ? appStyle.appGray : appStyle.appDarkBlue,
        }}
      >
        {props.content}
      </Text>
      <Text style={{ color: appStyle.appGray }}>{props.createdAt}</Text>
    </View>
  );
};

export default ChatMessage;
