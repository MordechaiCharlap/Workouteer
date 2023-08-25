import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import * as appStyle from "../../utils/appStyleSheet";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import * as firebase from "../../services/firebase";
import { messageTimeString } from "../../utils/timeFunctions";
import useAuth from "../../hooks/useAuth";
import { convertHexToRgba } from "../../utils/stylingFunctions";
const ChatMessage = ({
  message,
  chatId,
  messageSelected,
  selectedMessages,
  selectedMessageClicked,
}) => {
  const { user } = useAuth();
  const isSelfMessage = message.sender == user.id;
  const [checksNum, setChecksNum] = useState(!isSelfMessage ? 0 : 1);
  useEffect(() => {
    const seenByMe = async () => {
      if (!isSelfMessage) await firebase.seenByMe(user.id, chatId, message.id);
    };
    var seenByEverybody = true;
    for (var value of Object.values(message.seenBy)) {
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
  }, [message.seenBy]);
  return (
    <TouchableOpacity
      onLongPress={() => {
        messageSelected(message);
      }}
      onPress={() => {
        if (selectedMessages.length > 0) messageSelected(message);
      }}
      className={`${isSelfMessage ? "flex-row" : "flex-row-reverse"}`}
      style={{ paddingHorizontal: 3 }}
    >
      <View
        className={`p-1.5 rounded-b-2xl ${
          isSelfMessage
            ? "rounded-tr-2xl rounded-tl"
            : "rounded-tl-2xl rounded-tr"
        }`}
        style={{
          marginVertical: 2,
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
          {message.content}
        </Text>
        <View className="flex-row items-end">
          <Text
            style={{
              color: isSelfMessage
                ? appStyle.color_surface
                : appStyle.color_on_surface,
            }}
          >
            {messageTimeString(message.sentAt.toDate(), user.language)}
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
      </View>
      {selectedMessages.find(
        (selectedMessage) => selectedMessage.id == message.id
      ) && (
        <TouchableOpacity
          onLongPress={() => {
            selectedMessageClicked(message);
          }}
          onPress={() => selectedMessageClicked(message)}
          className="absolute left-0 right-0 top-0 bottom-0"
          style={{
            backgroundColor: convertHexToRgba(appStyle.color_primary, 0.2),
          }}
        ></TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default ChatMessage;
