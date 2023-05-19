import {
  StatusBar,
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
import * as appStyle from "../utilities/appStyleSheet";
import * as firebase from "../services/firebase";
import ChatMessage from "../components/ChatMessage";
import useAuth from "../hooks/useAuth";
import usePushNotifications from "../hooks/usePushNotifications";
import useAlerts from "../hooks/useAlerts";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import languageService from "../services/languageService";
import CustomTextInput from "../components/basic/CustomTextInput";
const ChatScreen = ({ route }) => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Chat");
      return () => leaveChat();
    }, [])
  );
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const { sendPushNotificationChatMessage } = usePushNotifications();
  const { user, setUser } = useAuth();
  const { chatsAlerts, setChatsAlerts } = useAlerts();
  const [chat, setChat] = useState(route.params.chat);
  const otherUser = route.params.otherUser;
  const db = firebase.db;
  const [messageText, setMessageText] = useState("");
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
  const currentDay = now();
  useEffect(() => {
    if (!chat) {
      const createChat = async () => {
        const newChat = await firebase.createNewPrivateChat(user, otherUser);
        setChat(newChat);
        await firebase.addChatConnection(otherUser.id, user.id, newChat.id);
        await firebase.addChatConnection(user.id, otherUser.id, newChat.id);
      };
      createChat();
    }
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
  const messageSelected = (message) => {};
  const sendMessage = async () => {
    if (messageText != "") {
      const content = messageText;
      setMessageText("");
      await firebase.sendPrivateMessage(user.id, otherUser.id, content, chat);
      await sendPushNotificationChatMessage(otherUser, user, content);
    }
  };
  const leaveChat = async () => {
    if (chat) {
      const chatsAlertsClone = { ...chatsAlerts };
      delete chatsAlertsClone[chat.id];
      setChatsAlerts(chatsAlertsClone);
      await firebase.removeChatAlerts(user.id, chat.id);
    }
  };
  return (
    <View style={safeAreaStyle()}>
      <View
        className="flex-row items-center"
        style={{
          backgroundColor: appStyle.color_surface,
          height: 70,
          borderBottomColor: appStyle.color_outline,
          borderBottomWidth: 0.5,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={40}
            color={appStyle.color_on_surface}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () =>
            navigation.navigate("User", {
              shownUser: otherUser,
              friendshipStatus: await firebase.checkFriendShipStatus(
                user,
                otherUser.id
              ),
            })
          }
          className="flex-row flex-1 items-center"
        >
          <Image
            source={{
              uri: otherUser.img,
            }}
            className="h-14 w-14 bg-white rounded-full mr-4"
          />
          <Text
            className="text-2xl font-semibold"
            style={{ color: appStyle.color_on_surface }}
          >
            {otherUser.displayName}
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS == "android" ? null : "padding"}
        enabled={false}
        keyboardVerticalOffset={-200}
      >
        <FlatList
          style={{ backgroundColor: appStyle.color_surface_variant }}
          contentContainerStyle={{ justifyContent: "flex-end", flexGrow: 1 }}
          className="p-2"
          showsVerticalScrollIndicator={false}
          extraData={true}
          data={messages}
          keyExtractor={(item) => item.id}
          inverted={true}
          renderItem={({ item }) => (
            <ChatMessage
              messageSelected={messageSelected}
              chatId={chat.id}
              message={item}
              user={user}
              currentDay={currentDay}
            />
          )}
        />
        {!user.isDeleted ? (
          <View
            className="flex-row p-2 items-center"
            style={{ backgroundColor: appStyle.color_background_variant }}
          >
            <TextInput
              className="text-2xl flex-1 mr-2 rounded py-1 px-4"
              multiline={true}
              showsVerticalScrollIndicator={false}
              placeholder={
                languageService[user.language].message[user.isMale ? 1 : 0]
              }
              placeholderTextColor={appStyle.color_on_surface_variant}
              style={{
                maxHeight: 80,
                backgroundColor: appStyle.color_surface_variant,
                color: appStyle.color_primary,
              }}
              onChangeText={(text) => {
                setMessageText(text);
              }}
              value={messageText}
            ></TextInput>
            <View
              className="rounded-full w-10 h-10 items-center justify-center"
              style={{ backgroundColor: appStyle.color_background }}
            >
              <TouchableOpacity onPress={() => sendMessage()}>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  size={25}
                  color={appStyle.color_primary}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            className="p-2"
            style={{
              backgroundColor: appStyle.color_primary,
              borderTopColor: appStyle.color_on_primary,
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
    </View>
  );
};

export default ChatScreen;
