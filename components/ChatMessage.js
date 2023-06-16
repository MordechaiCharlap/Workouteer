import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import * as appStyle from "../utilities/appStyleSheet";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import * as firebase from "../services/firebase";
import { messageTimeString } from "../services/timeFunctions";
const ChatMessage = (props) => {
  const isSelfMessage = props.message.sender == props.user.id;
  const [checksNum, setChecksNum] = useState(!isSelfMessage ? 0 : 1);
  useEffect(() => {
    const seenByMe = async () => {
      if (!isSelfMessage)
        await firebase.seenByMe(props.user.id, props.chatId, props.message.id);
    };
    var seenByEverybody = true;
    for (var value of Object.values(props.message.seenBy)) {
      if (value == false) {
        seenByEverybody = false;
        break;
      }
    }
    if (isSelfMessage && seenByEverybody == true) {
      setChecksNum(2);
    } else if (!isSelfMessage && !seenByEverybody) {
      seenByMe();
    }
  }, [props.message.seenBy]);
  return (
    <View className={`${isSelfMessage ? "flex-row" : "flex-row-reverse"}`}>
      <TouchableOpacity
        onLongPress={() => {
          props.messageSelected(props.message);
        }}
        className={`mt-1 p-1.5 rounded-b-2xl ${
          isSelfMessage
            ? "rounded-tr-2xl rounded-tl"
            : "rounded-tl-2xl rounded-tr"
        }`}
        style={{
          maxWidth: "90%",
          backgroundColor: isSelfMessage
            ? appStyle.color_on_surface_variant
            : appStyle.color_surface,
        }}
      >
        <Text
          className="text-xl"
          style={{
            color: isSelfMessage
              ? appStyle.color_surface
              : appStyle.color_on_surface,
          }}
        >
          {props.message.content}
        </Text>
        <View className="flex-row items-end">
          <Text
            style={{
              color: isSelfMessage
                ? appStyle.color_surface
                : appStyle.color_on_surface,
            }}
          >
            {messageTimeString(
              props.message.sentAt.toDate(),
              props.user.language
            )}
          </Text>
          {isSelfMessage && (
            <View className="ml-2">
              <FontAwesomeIcon
                icon={checksNum == 1 ? faCheck : faCheckDouble}
                size={15}
                color={appStyle.color_surface}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ChatMessage;
