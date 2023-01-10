import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import * as appStyle from "./AppStyleSheet";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import * as firebase from "../services/firebase";
const ChatMessage = (props) => {
  const isSelfMessage = props.message.sender == props.user.id;
  const [checksNum, setChecksNum] = useState(!isSelfMessage ? 0 : 1);
  useEffect(() => {
    const seenByMe = async () => {
      await firebase.seenByMe(props.user.id, props.chatId, props.message.id);
    };
    const seenByMap = new Map(Object.entries(props.message.seenBy));
    var seenByEveryBody = true;
    for (var value of seenByMap.values()) {
      if (value == false) {
        seenByEveryBody = false;
        break;
      }
    }
    if (isSelfMessage && seenByEveryBody == true) {
      setChecksNum(2);
    } else if (!isSelfMessage && !seenByEveryBody) {
      seenByMe();
    }
  }, [props.message.seenBy]);

  const convertTimestamp = (timestamp) => {
    const date = timestamp.toDate();
    //workaround
    // date.setHours(date.getHours() + 2);
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
      <TouchableOpacity
        onLongPress={() => {
          props.messageSelected(props.message);
        }}
        className="mt-1 p-1.5 rounded"
        style={{
          maxWidth: "90%",
          backgroundColor: isSelfMessage
            ? appStyle.color_primary_variant
            : appStyle.color_bg_variant,
        }}
      >
        <Text
          className="text-xl"
          style={{
            color: isSelfMessage
              ? appStyle.color_on_primary
              : appStyle.color_on_primary,
          }}
        >
          {props.message.content}
        </Text>
        <View className="flex-row items-end">
          <Text
            style={{
              color: isSelfMessage
                ? appStyle.color_on_primary
                : appStyle.color_on_primary,
            }}
          >
            {convertTimestamp(props.message.sentAt)}
          </Text>
          {isSelfMessage ? (
            <View className="ml-2">
              <FontAwesomeIcon
                icon={checksNum == 1 ? faCheck : faCheckDouble}
                size={15}
                color={appStyle.color_on_primary}
              />
            </View>
          ) : (
            <></>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ChatMessage;
