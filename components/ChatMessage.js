import { View, Text } from "react-native";
import React from "react";
import * as appStyle from "./AppStyleSheet";
const ChatMessage = (props) => {
  return (
    <View
      className="rounded w-10/12"
      style={{
        backgroundColor:
          props.sender == props.user.usernameLower
            ? appStyle.appAzure
            : appStyle.appGray,
      }}
    >
      <Text
        className="text-xl"
        style={{
          color:
            props.sender == props.user.usernameLower
              ? appStyle.appGray
              : appStyle.appDarkBlue,
        }}
      >
        {props.content}
      </Text>
      <Text style={{ color: appStyle.appGray }}>{props.createdAt}</Text>
    </View>
  );
};

export default ChatMessage;
