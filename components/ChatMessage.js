import { View, Text } from "react-native";
import React from "react";
import * as appStyle from "./AppStyleSheet";
const ChatMessage = (props) => {
  const isSelfMessage = props.message.sender == props.user.usernameLower;
  const convertTimestamp = (timestamp) => {
    const date = timestamp.toDate();
    //workaround
    date.setHours(date.getHours() + 2);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const h = (date.getHours() < 10 ? "0" : "") + date.getHours();
    const m = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    if (props.currentDay.day == day) {
      return h + ":" + m;
    } else {
      const yasterday = new Date();
      yasterday.setDate(yasterday.getDate() - 1);
      if (yasterday.toDateString() == date.toDateString()) {
        return "Yasterday " + h + ":" + m;
      }
      return `${day}/${month} ${h}:${m}`;
    }
  };
  return (
    <View className={`${isSelfMessage ? "flex-row" : "flex-row-reverse"}`}>
      <View
        className="mt-1 p-1.5 rounded"
        style={{
          maxWidth: "90%",
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
          {convertTimestamp(props.message.sentAt)}
        </Text>
      </View>
    </View>
  );
};

export default ChatMessage;
