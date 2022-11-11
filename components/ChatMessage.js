import { View, Text } from "react-native";
import React from "react";
import * as appStyle from "./AppStyleSheet";
const ChatMessage = (props) => {
  const isSelfMessage = props.message.sender == props.user.usernameLower;
  return (
    <View className={`${isSelfMessage ? "flex-row-reverse" : "flex-row"}`}>
      <View
        className={`rounded mt-1 px-3`}
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
        <Text style={{ color: appStyle.appGray }}>
          {props.message.createdAt}
        </Text>
      </View>
    </View>
  );
};

export default ChatMessage;
