import { View, Text } from "react-native";
import React from "react";
import * as appStyle from "./AppStyleSheet";
const ChatMessage = (props) => {
  const isSelfMessage = props.message.sender == props.user.usernameLower;
  const sentAtText = (date) => {
    console.log("msg date: " + date.toLocaleDateString());
    return date.toDateString();
  };
  return (
    <View className={`${isSelfMessage ? "flex-row" : "flex-row-reverse"}`}>
      <View
        className="mt-1 p-1.5 rounded"
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
          {props.message.content}
        </Text>
        <Text
          style={{
            color: isSelfMessage ? appStyle.appGray : appStyle.appDarkBlue,
          }}
        >
          {sentAtText(props.message.sentAt.toDate())}
        </Text>
      </View>
    </View>
  );
};

export default ChatMessage;
