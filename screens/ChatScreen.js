import {
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
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
  const navigation = useNavigation();
  const { user } = useContext(authContext);
  const otherUser = route.params.otherUser;
  const [messageText, setMessageText] = useState("");

  const [messagesArr, setMessagesArr] = useState(null);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });
  useEffect(() => {
    const getFirstPageMessages = async () => {
      const messagesArr = await firebase.getFirstPageMessages(
        route.params.chat.id
      );
      setMessagesArr(messagesArr);
    };
    getFirstPageMessages();
  }, []);
  const sendMessage = async () => {
    if (messageText != "") {
      const content = messageText;
      setMessageText("");
      await firebase.sendMessage(user, otherUser, content);
    }
  };
  const getMessages = () => {
    return (
      <FlatList
        data={messagesArr}
        keyExtractor={(item) => item.id}
        inverted={true}
        renderItem={({ item }) => <ChatMessage message={item} user={user} />}
      />
    );
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
        </View>
        {messagesArr == null ? (
          <Text
            className="text-center text-xl font-semibold m-4"
            style={{ color: appStyle.appGray }}
          >
            Loading...
          </Text>
        ) : (
          <></>
        )}
        {getMessages()}
      </View>
      <View className="flex-row p-2 items-center">
        <TextInput
          className="text-2xl flex-1 mr-2 rounded-full py-1 pl-4"
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
