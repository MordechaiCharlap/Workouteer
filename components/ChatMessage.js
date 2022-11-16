import { View, Text } from "react-native";
import React from "react";
import * as appStyle from "./AppStyleSheet";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import * as firebase from "../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";
const ChatMessage = (props) => {
  const [message, setMessage] = useState(props.message);
  const isSelfMessage = message.sender == props.user.usernameLower;
  const [checksNum, setChecksNum] = useState(!isSelfMessage ? 0 : 1);
  const db = firebase.db;
  useEffect(() => {
    const seenByMe = async () => {
      console.log("seeing message for the first time");
      await firebase.seenByMe(
        props.user.usernameLower,
        props.chatId,
        message.id
      );
    };
    const seenByMap = new Map(Object.entries(message.seenBy));
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
  }, [message]);
  useEffect(() => {
    return onSnapshot(
      doc(db, `chats/${props.chatId}/messages/${message.id}`),
      (doc) => {
        console.log(doc.id + " has changed");
        setMessage({ id: doc.id, ...doc.data() });
      }
    );
  }, []);
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
          {message.content}
        </Text>
        <View className="flex-row items-end">
          <Text
            style={{
              color: isSelfMessage ? appStyle.appGray : appStyle.appDarkBlue,
            }}
          >
            {convertTimestamp(message.sentAt)}
          </Text>
          {isSelfMessage ? (
            <View className="ml-2">
              <FontAwesomeIcon
                icon={checksNum == 1 ? faCheck : faCheckDouble}
                size={15}
                color={appStyle.appGray}
              />
            </View>
          ) : (
            <></>
          )}
        </View>
      </View>
    </View>
  );
};

export default ChatMessage;
