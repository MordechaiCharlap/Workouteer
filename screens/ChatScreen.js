import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../utils/appStyleSheet";
import * as firebase from "../services/firebase";
import ChatMessage from "../components/chat/ChatMessage";
import useAuth from "../hooks/useAuth";
import usePushNotifications from "../hooks/usePushNotifications";
import useAlerts from "../hooks/useAlerts";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import languageService from "../services/languageService";
import CustomTextInput from "../components/basic/CustomTextInput";
import useFirebase from "../hooks/useFirebase";
import CustomText from "../components/basic/CustomText";
import ChatHeader from "../components/chat/ChatHeader";
import CustomModal from "../components/basic/CustomModal";
const ChatScreen = ({ route }) => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Chat");
      return () => cleanAlerts();
    }, [])
  );
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const { sendPushNotificationChatMessage } = usePushNotifications();
  const { user } = useAuth();
  const { chatsAlerts, setChatsAlerts } = useAlerts();
  const [chat, setChat] = useState(route.params.chat);
  const otherUser = route.params.otherUser;
  const { db } = useFirebase();
  const [messageText, setMessageText] = useState("");
  const [showDeleteMessagesModal, setShowDeleteMessagesModal] = useState(false);
  const now = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    return {
      year: year,
      month: month,
      day: day,
    };
  };
  // const currentDay = now();
  useEffect(() => {
    if (chat) return;
    firebase.createNewPrivateChat(user, otherUser).then((newChat) => {
      setChat(newChat);
      firebase.addChatConnection(otherUser.id, user.id, newChat.id);
      firebase.addChatConnection(user.id, otherUser.id, newChat.id);
    });
  }, [chat]);
  useEffect(() => {
    if (chat && messages.length == 0) {
      const joinDateTS = chat.members[user.id].joinDate;
      var messagesClone = messages.slice();
      const q = query(
        collection(db, `chats/${chat.id}/messages`),
        where("sentAt", ">", joinDateTS),
        orderBy("sentAt", "asc")
      );
      return onSnapshot(q, (querySnapshot) => {
        querySnapshot.docChanges().map((change) => {
          const messageDoc = change.doc.data();
          if (change.type === "added") {
            const newMessage = {
              id: change.doc.id,
              ...messageDoc,
            };
            messagesClone = [newMessage, ...messagesClone];
          } else if (change.type === "modified") {
            const modifiedMessage = {
              id: change.doc.id,
              ...messageDoc,
            };
            var messageInserted = false;
            for (var i = 0; i < messagesClone.length; i++) {
              if (messagesClone[i].id == modifiedMessage.id) {
                messagesClone[i] = modifiedMessage;
                messageInserted = true;
                break;
              }
            }
          }
        });
        setMessages(messagesClone.slice());
      });
    }
  }, [chat]);
  const selectedMessageClicked = (selectedMessage) => {
    const selectedMessagesClone = [...selectedMessages];
    const messageAlreadySelectedIndex = selectedMessagesClone.findIndex(
      (message) => message.id == selectedMessage.id
    );
    selectedMessagesClone.splice(messageAlreadySelectedIndex, 1);
    setSelectedMessages(selectedMessagesClone);
  };
  const clearSelectedMessages = () => {
    setSelectedMessages([]);
  };
  const messageSelected = (newSelectedMessage) => {
    const selectedMessagesClone = [...selectedMessages];
    const indexToPush = selectedMessagesClone.findIndex(
      (message) => message.sentAt.toDate() > newSelectedMessage.sentAt.toDate()
    );
    if (indexToPush != -1) {
      selectedMessagesClone.splice(indexToPush, 0, newSelectedMessage);
    } else {
      selectedMessagesClone.push(newSelectedMessage);
    }

    setSelectedMessages(selectedMessagesClone);
  };
  const deleteSelectedMessages = () => {};
  const sendMessage = () => {
    if (messageText != "") {
      if (!user.chats[chat.id]) {
        firebase.addChatConnection(user.id, otherUser.id, chat.id);
      }
      const content = messageText;
      setMessageText("");
      firebase.sendPrivateMessage(user.id, otherUser.id, content, chat);
      sendPushNotificationChatMessage(otherUser, user, content, chat.id);
    }
  };
  const cleanAlerts = () => {
    if (chat) {
      const chatsAlertsClone = { ...chatsAlerts };
      delete chatsAlertsClone[chat.id];
      setChatsAlerts(chatsAlertsClone);
      firebase.removeChatAlerts(user.id, chat.id);
    }
  };
  return (
    <View style={safeAreaStyle()}>
      <ChatHeader
        otherUser={otherUser}
        selectedMessages={selectedMessages}
        deleteSelectedMessages={deleteSelectedMessages}
        clearSelectedMessages={clearSelectedMessages}
      />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS == "android" ? null : "padding"}
        enabled={false}
        keyboardVerticalOffset={-200}
      >
        <FlatList
          style={{ backgroundColor: appStyle.color_surface_variant }}
          contentContainerStyle={{
            justifyContent: "flex-end",
            rowGap: 3,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          extraData={true}
          data={messages}
          keyExtractor={(item) => item.id}
          inverted={true}
          renderItem={({ item }) => (
            <ChatMessage
              selectedMessages={selectedMessages}
              messageSelected={messageSelected}
              chatId={chat.id}
              message={item}
              selectedMessageClicked={selectedMessageClicked}
            />
          )}
        />
        {!otherUser.isDeleted ? (
          <View
            className="flex-row p-2 items-center"
            style={{ backgroundColor: appStyle.color_background_variant }}
          >
            <TextInput
              className="text-2xl flex-1 mr-2 rounded py-1 px-4"
              multiline={true}
              showsVerticalScrollIndicator={false}
              spellCheck={false}
              autoCorrect={false}
              placeholder={
                languageService[user.language].message[user.isMale ? 1 : 0]
              }
              placeholderTextColor={appStyle.color_on_surface_variant}
              style={{
                maxHeight: 80,
                backgroundColor: appStyle.color_surface_variant,
                color: appStyle.color_on_surface,
              }}
              onChangeText={(text) => {
                setMessageText(text);
              }}
              value={messageText}
            ></TextInput>
            <View
              className="rounded-full w-10 h-10 items-center justify-center"
              style={{ backgroundColor: appStyle.color_tertiary }}
            >
              <TouchableOpacity onPress={() => sendMessage()}>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  size={25}
                  color={appStyle.color_on_tertiary}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            className="p-2"
            style={{
              backgroundColor: appStyle.color_tertiary,
              borderTopColor: appStyle.color_on_tertiary,
              borderTopWidth: 1,
            }}
          >
            <Text
              className="text-center"
              style={{ color: appStyle.color_background }}
            >
              {languageService[user.language].cannotSendMessagesToDeletedUser}
            </Text>
          </View>
        )}
      </KeyboardAvoidingView>
      <CustomModal
        showModal={showDeleteMessagesModal}
        setShowModal={setShowDeleteMessagesModal}
        cancelButton
        confirmButton
        confirmText={languageService[user.language].deleteForMe}
      >
        <CustomText className="text-xl" style={{ paddingBottom: 20 }}>
          {languageService[user.language].areYouSureYouWantToDeleteMessages(
            user.isMale
          )}
        </CustomText>
      </CustomModal>
    </View>
  );
};

export default ChatScreen;
