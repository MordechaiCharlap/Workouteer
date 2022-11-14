import {
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useContext, useLayoutEffect, useState, useEffect } from "react";
import authContext from "../context/authContext";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronLeft,
  faCommentDots,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import ChatMessage from "../components/ChatMessage";
const ChatScreen = ({ route }) => {
  const [snapShot, setSnapshot] = useState(null);
  const [messages, setMessages] = useState(null);
  const navigation = useNavigation();
  const { user } = useContext(authContext);
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
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });
  useEffect(() => {
    const q = query(
      collection(
        db,
        `chats/${user.usernameLower}-${otherUser.usernameLower}/messages`
      ),
      orderBy("sentAt", "desc"),
      limit(5)
    );

    const unsuscribe = onSnapshot(q, (querySnapshot) => {
      setSnapshot(querySnapshot);
    });
    return () => {
      unsuscribe();
    };
  }, [route.params.chat]);

  useEffect(() => {
    if (snapShot != null) {
      if (messages === null) {
        console.log("setting messages the first time");
        setMessages(snapShot.docs);
      } else {
        console.log("updating messages");
        setMessages([...snapShot.docs, ...messages]);
      }
    }
  }, [snapShot]);
  // useEffect(() => {
  //   const chatPals = new Map(Object.entries(user.chatPals));
  //   if (chatPals.has(otherUser.usernameLower)) {
  //     const getFirstPageMessages = async () => {
  //       const messagesArr = await firebase.getFirstPageMessages(
  //         user.usernameLower + "-" + otherUser.usernameLower
  //       );
  //       setMessagesArr(messagesArr);
  //     };
  //     getFirstPageMessages();
  //   }
  //   chatUpdatesListener();
  // }, []);
  // const chatUpdatesListener = () => {
  //   const q = query(
  //     collection(
  //       db,
  //       `chats/${user.usernameLower}-${otherUser.usernameLower}/messages`
  //     ),
  //     where("sentAt", ">", route.params.chat.lastMessage.sentAt),
  //     orderBy("sentAt", "desc")
  //   );
  //   return onSnapshot(q, (querySnapshot) => {
  //     querySnapshot.docChanges().forEach((change) => {
  //       if (change.type === "added") {
  //         if (firstSnapshot) {
  //           console.log("First snapshot");
  //           setFirstSnapshot(false);
  //           console.log(firstSnapshot);
  //         } else {
  //           console.log("Not first snapshot");
  //           const newMessage = change.doc.data();
  //           console.log(newMessage);
  //           const arrClone = messagesArr.slice();
  //           arrClone.unshift({
  //             id: doc.id,
  //             content: message.content,
  //             isRead: message.isRead,
  //             sender: message.sender,
  //             sentAt: message.sentAt,
  //           });
  //           setMessagesArr(arrClone);
  //         }
  //       }
  //     });
  //   });
  // };

  const sendMessage = async () => {
    if (messageText != "") {
      const content = messageText;
      setMessageText("");
      await firebase.sendMessage(user, otherUser, content);
    }
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1">
        <View
          className="flex-row items-center pb-3 pt-2"
          style={{ backgroundColor: "#333946" }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={40}
              color={appStyle.appGray}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("User", { shownUser: otherUser })
            }
            className="flex-row items-center"
          >
            <Image
              source={{
                uri: otherUser.img,
              }}
              className="h-14 w-14 bg-white rounded-full mr-4"
            />
            <Text
              className="text-2xl font-semibold"
              style={{ color: appStyle.appGray }}
            >
              {otherUser.username}
            </Text>
          </TouchableOpacity>
        </View>
        {messages == null ? (
          <Text
            className="text-center text-xl font-semibold m-4"
            style={{ color: appStyle.appGray }}
          >
            Loading...
          </Text>
        ) : (
          <FlatList
            className="p-2"
            showsVerticalScrollIndicator={false}
            data={messages}
            keyExtractor={(item) => item.id}
            inverted={true}
            renderItem={({ item }) => (
              <ChatMessage message={item} user={user} currentDay={currentDay} />
            )}
          />
        )}
      </View>
      <View className="flex-row p-2 items-center">
        <TextInput
          className="text-2xl flex-1 mr-2 rounded py-1 px-4"
          multiline={true}
          placeholder="Message"
          placeholderTextColor={appStyle.appGray}
          style={{ backgroundColor: "#333946", color: appStyle.appGray }}
          onChangeText={(text) => {
            setMessageText(text);
          }}
          value={messageText}
        ></TextInput>
        <View
          className="rounded-full w-10 h-10 items-center justify-center"
          style={{ backgroundColor: "#25c5e8" }}
        >
          <TouchableOpacity onPress={() => sendMessage()}>
            <FontAwesomeIcon
              icon={faChevronRight}
              size={25}
              color={appStyle.appGray}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
