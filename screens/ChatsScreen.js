import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { React, useLayoutEffect, useState } from "react";
import ResponsiveStyling from "../components/ResponsiveStyling";
import BottomNavbar from "../components/BottomNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import { useCallback } from "react";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import { useEffect } from "react";
const ChatsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [chatsArr, setChatArr] = useState(null);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });
  useFocusEffect(
    useCallback(() => {
      const getChats = async () => {
        console.log("getting chats");
        setChatArr(await firebase.getChatsArrayIncludeUsers(user));
      };
      getChats();
    }, [])
  );
  useEffect(() => {
    if (chatsArr != null) {
      console.log(chatsArr);
      console.log(chatsArr[0]);
    }
  }, [chatsArr]);
  const now = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    return {
      date: today,
      year: year,
      month: month,
      day: day,
    };
  };
  const currentDay = now();
  const chatClicked = async (item) => {
    navigation.navigate("Chat", {
      otherUser: item.user,
      chat: item.chat,
    });
  };
  const convertTimestamp = (timestamp) => {
    const date = timestamp.toDate();
    //workaround
    date.setHours(date.getHours() + 2);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const h = (date.getHours() < 10 ? "0" : "") + date.getHours();
    const m = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    if (currentDay.day == day) {
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
  const chatsList = () => {
    const lastMessageConverter = (lastMessage) => {
      var shownText =
        (lastMessage.sender == user.usernameLower
          ? "You: "
          : `${lastMessage.sender}:`) + lastMessage.content;
      if (shownText.length > 35) shownText = shownText.slice(0, 35) + "...";
      return <Text style={{ color: "#c5c6c8" }}>{shownText}</Text>;
    };
    return (
      <FlatList
        data={chatsArr}
        keyExtractor={(item) => item.chat.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => chatClicked(item)} className="mt-2 ">
            <View className="flex-row">
              <Image
                source={{
                  uri: item.user.img,
                }}
                className="h-14 w-14 bg-white rounded-full mr-4"
              />
              <View className="flex-1">
                <View className="flex-row justify-between">
                  <Text
                    className="text-xl font-semibold tracking-wider"
                    style={{ color: appStyle.appGray }}
                  >
                    {item.user.displayName}
                  </Text>
                  <Text className="mt-1" style={{ color: "#c5c6c8" }}>
                    {convertTimestamp(item.chat.lastMessage.sentAt)}
                  </Text>
                </View>
                {lastMessageConverter(item.chat.lastMessage)}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  };
  const showFriends = async () => {
    const friendsArr = await firebase.getFriendsArray(user);
    navigation.navigate("Friends", { friendsArray: friendsArr });
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="pt-5 px-5 flex-1">
        <Header title="Chats" />
        <View
          className="rounded-xl mt-4 p-3"
          style={{ backgroundColor: appStyle.appDarkBlueGrayer }}
        >
          <View className="flex-row items-center">
            <TouchableOpacity>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                size={24}
                color={appStyle.appDarkBlue}
              />
            </TouchableOpacity>
            <TextInput
              style={{ color: appStyle.appGray }}
              placeholder="Search"
              placeholderTextColor={appStyle.appDarkBlue}
              className="text-xl ml-3"
            />
          </View>
        </View>
        <View className="flex-1">
          {chatsArr == null ? (
            <Text
              className="text-center text-xl font-semibold m-4"
              style={{ color: appStyle.appGray }}
            >
              Loading...
            </Text>
          ) : (
            chatsList()
          )}

          <TouchableOpacity
            onPress={showFriends}
            className="rounded-full aspect-square w-20 items-center justify-center absolute right-0 bottom-10"
            style={{ backgroundColor: appStyle.appLightBlue }}
          >
            <FontAwesomeIcon
              icon={faPenToSquare}
              size={50}
              color={appStyle.appDarkBlue}
            />
          </TouchableOpacity>
        </View>
      </View>

      <BottomNavbar currentScreen="Chats" />
    </SafeAreaView>
  );
};

export default ChatsScreen;
