import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Modal,
  StyleSheet,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { React, useLayoutEffect, useState, useCallback } from "react";
import responsiveStyle from "../components/ResponsiveStyling";
import BottomNavbar from "../components/BottomNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMagnifyingGlass,
  faPenToSquare,
  faArrowLeft,
  faTrash,
  faSquare,
  faCheckSquare,
} from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
const ChatsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [chatsArr, setChatArr] = useState(null);
  const [selectedChats, setSelectedChats] = useState([]);
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

  const chatLongClicked = (item) => {
    const selectedChatsClone = selectedChats.slice();
    const index = selectedChatsClone.findIndex(
      (arrayItem) => arrayItem.chat.id == item.chat.id
    );
    if (index > -1) {
      selectedChatsClone.splice(index, 1);
    } else {
      selectedChatsClone.push(item);
    }
    setSelectedChats(selectedChatsClone);

    console.log(selectedChatsClone);
  };

  const chatClicked = async (item) => {
    const selectedChatsClone = selectedChats.slice();
    if (selectedChats.length == 0) {
      navigation.navigate("Chat", {
        otherUser: item.user,
        chat: item.chat,
      });
    } else {
      const index = selectedChats.findIndex(
        (arrayItem) => arrayItem.chat.id == item.chat.id
      );
      if (index > -1) {
        selectedChatsClone.splice(index, 1);
        setSelectedChats(selectedChatsClone);
      }
    }
  };
  const deleteSelectedChatsPopup = async () => {
    setModalVisible(true);
  };
  const deleteSelectedChats = async () => {
    for (var selectedChat of selectedChats) {
      if (selectedChat.chat.isGroupChat) {
        await firebase.deleteGroupChatForUser(user, selectedChat);
      } else {
        await firebase.deletePrivateChatForUser(user, selectedChat);
      }
    }
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
        className="mt-2"
        keyExtractor={(item) => item.chat.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => chatLongClicked(item)}
            onPress={() => chatClicked(item)}
            className="p-2 rounded"
            style={{
              backgroundColor: appStyle.appDarkBlue,
            }}
          >
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
            {selectedChats.length > 0 && (
              <View className="absolute top-0 bottom-0 justify-center">
                <View
                  className="rounded-lg p-1"
                  style={{ backgroundColor: appStyle.appDarkBlue }}
                >
                  <FontAwesomeIcon
                    icon={
                      selectedChats.some(
                        (selectedItem) => selectedItem.chat.id == item.chat.id
                      )
                        ? faCheckSquare
                        : faSquare
                    }
                    color={appStyle.appGray}
                    size={30}
                  />
                </View>
              </View>
            )}
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
    <SafeAreaView style={responsiveStyle.safeAreaStyle}>
      <Header title="Chats" />
      <View className="px-4 flex-1">
        {selectedChats.length == 0 ? (
          <View
            className="rounded-xl"
            style={{ backgroundColor: appStyle.appDarkBlueGrayer }}
          >
            <View className="flex-row items-center h-12 p-3">
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
        ) : (
          <View className="flex-row items-center h-12 justify-between">
            <TouchableOpacity onPress={() => setSelectedChats([])}>
              <FontAwesomeIcon
                icon={faArrowLeft}
                size={24}
                color={appStyle.appGray}
              />
            </TouchableOpacity>

            <Text
              className="text-2xl font-bold ml-4"
              style={{ color: appStyle.appGray }}
            >
              {selectedChats.length}
            </Text>
            <TouchableOpacity onPress={() => deleteSelectedChatsPopup()}>
              <FontAwesomeIcon
                icon={faTrash}
                size={24}
                color={appStyle.appGray}
              />
            </TouchableOpacity>
          </View>
        )}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{ backgroundColor: appStyle.appLightBlue }}
          className="absolute bottom-0 items-center w-full h-20"
        >
          <Text className="font-bold text-xl p-1">Are you sure?</Text>
          <View className="flex-row w-10/12 justify-between">
            <TouchableOpacity
              className="w-1/3 p-1"
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(!modalVisible);
                deleteSelectedChats();
              }}
            >
              <Text className="text-center">Delete chats!</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-1/3 p-1"
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(!modalVisible);
                setSelectedChats([]);
              }}
            >
              <Text className="text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const styles = new StyleSheet.create({
  modalButton: {
    backgroundColor: appStyle.appGray,
  },
});
export default ChatsScreen;
