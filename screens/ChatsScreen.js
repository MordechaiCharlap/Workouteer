import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { React, useState, useCallback } from "react";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCheck,
  faCheckDouble,
  faMagnifyingGlass,
  faPenToSquare,
  faArrowLeft,
  faTrash,
  faSquare,
  faCheckSquare,
  faCheckCircle,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../utilities/appStyleSheet";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
import useAlerts from "../hooks/useAlerts";
import AlertDot from "../components/AlertDot";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
import languageService from "../services/languageService";
import { messageTimeString } from "../services/timeFunctions";
const ChatsScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { setScreen } = useNavbarNavigation();
  const { chatsAlerts } = useAlerts();
  const [modalVisible, setModalVisible] = useState(false);
  const [chatsArr, setChatsArr] = useState(null);
  const [selectedChats, setSelectedChats] = useState([]);
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Chats");
      setScreen("Chats");
      const getChats = async () => {
        var arr = await firebase.getChatsArrayIncludeUsers(user);
        setChatsArr(arr);
      };
      getChats();
    }, [chatsAlerts])
  );

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
    const chatsArrClone = chatsArr.slice();
    // Loop through the selectedChats array and remove the corresponding
    // elements from the arr array.
    for (let selectedChat of selectedChats) {
      const index = chatsArrClone.findIndex(
        (arrayItem) => arrayItem.chat.id == selectedChat.chat.id
      );
      chatsArrClone.splice(index, 1);
    }
    setChatsArr(chatsArrClone);
    setSelectedChats([]);
    for (var selectedChat of selectedChats) {
      if (selectedChat.chat.isGroupChat) {
        await firebase.deleteGroupChatForUser(user, selectedChat);
      } else {
        await firebase.deletePrivateChatForUser(
          user,
          selectedChat,
          chatsAlerts[selectedChat.chat.id]
        );
      }
    }
  };
  const chatsList = () => {
    const lastMessageConverter = (lastMessage, isAlert, isMyMessage) => {
      var shownText = lastMessage.content;
      switch (isAlert) {
        case true:
          if (shownText.length > 40)
            shownText = shownText.slice(0, 40).trim() + "...";
          break;
        case false:
          if (isMyMessage) {
            if (shownText.length > 42)
              shownText = shownText.slice(0, 42).trim() + "...";
          } else {
            if (shownText.length > 44)
              shownText = shownText.slice(0, 44).trim() + "...";
          }
      }
      return (
        <Text style={{ color: appStyle.color_on_background }}>{shownText}</Text>
      );
    };
    return (
      <FlatList
        data={chatsArr}
        keyExtractor={(item) => item.chat.id}
        renderItem={({ item }) =>
          item.chat.messagesCount > 0 && (
            <TouchableOpacity
              onLongPress={() => chatLongClicked(item)}
              onPress={() => chatClicked(item)}
              className="relative py-2"
              style={{
                paddingHorizontal: 16,
                borderBottomColor: appStyle.color_outline,
                borderBottomWidth: 0.3,
              }}
            >
              <View className="flex-row">
                <Image
                  style={{
                    borderWidth: 0.5,
                    borderColor: appStyle.color_outline,
                  }}
                  source={{
                    uri: item.user.img,
                  }}
                  className="h-14 w-14 bg-white rounded-full mr-4"
                />
                <View className="flex-1">
                  <View className="flex-row justify-between">
                    <Text
                      className="text-xl font-semibold tracking-wider"
                      style={{ color: appStyle.color_on_background }}
                    >
                      {item.user.displayName}
                    </Text>
                    <Text
                      className="mt-1"
                      style={{
                        color: appStyle.color_on_background,
                        fontSize: 12,
                      }}
                    >
                      {messageTimeString(
                        item.chat.lastMessage.sentAt.toDate(),
                        user.language
                      )}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      {item.chat.lastMessage.sender == user.id &&
                        (Object.values(item.chat.lastMessage.seenBy).every(
                          (value) => value == true
                        ) ? (
                          <View className="mr-0.5">
                            <FontAwesomeIcon
                              icon={faCheckDouble}
                              color={appStyle.color_background_variant}
                              size={15}
                            />
                          </View>
                        ) : (
                          <View className="mr-0.5">
                            <FontAwesomeIcon
                              icon={faCheck}
                              color={appStyle.color_background_variant}
                              size={15}
                            />
                          </View>
                        ))}
                      {lastMessageConverter(
                        item.chat.lastMessage,
                        chatsAlerts[item.chat.id] != null,
                        item.chat.lastMessage.sender == user.id
                      )}
                    </View>

                    {chatsAlerts[item.chat.id] && (
                      <View>
                        <AlertDot
                          text={chatsAlerts[item.chat.id]}
                          textColor={appStyle.color_background}
                          color={appStyle.color_on_background}
                          fontSize={10}
                          size={23}
                        />
                      </View>
                    )}
                  </View>
                </View>
                {selectedChats.length > 0 && (
                  <View className="absolute top-0 bottom-0 justify-center right-0">
                    <View
                      className="rounded-full"
                      style={{
                        backgroundColor: appStyle.color_on_primary,
                        padding: 1,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={
                          selectedChats.some(
                            (selectedItem) =>
                              selectedItem.chat.id == item.chat.id
                          )
                            ? faCheckCircle
                            : faCircle
                        }
                        color={appStyle.color_on_background}
                        size={30}
                      />
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )
        }
      />
    );
  };
  const showFriends = async () => {
    navigation.navigate("Friends", { user: user, isMyUser: true });
  };
  return (
    <View style={safeAreaStyle()}>
      <View
        className="flex-row items-center h-10 mt-4 mb-2 justify-center"
        style={{
          borderBottomColor: appStyle.color_outline,
          borderBottomWidth: 0.7,
        }}
      >
        <Text
          className="text-4xl font-semibold"
          style={{ color: appStyle.color_on_background }}
        >
          {languageService[user.language].chats}
        </Text>
        {Object.keys(chatsAlerts).length > 0 && (
          <View className="absolute right-0 mr-4">
            <AlertDot
              text={Object.keys(chatsAlerts).length}
              textColor={appStyle.color_background}
              color={appStyle.color_on_background}
              size={35}
            />
          </View>
        )}
      </View>
      <View className="flex-1">
        {selectedChats.length == 0 ? (
          <>
            {/* {chatsArr != null && chatsArr.length != 0 && (
              <View
                className="rounded-xl"
                style={{ backgroundColor: appStyle.color_darker }}
              >
                <View className="flex-row items-center h-12 p-3">
                  <TouchableOpacity>
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      size={24}
                      color={appStyle.color_on_primary}
                    />
                  </TouchableOpacity>
                  <TextInput
                    style={{ color: appStyle.color_on_primary }}
                    placeholder="Search"
                    placeholderTextColor={appStyle.color_on_primary}
                    className="text-xl ml-3"
                  />
                </View>
              </View>
            )} */}
          </>
        ) : (
          <View
            className="flex-row items-center h-12 justify-between"
            style={{
              paddingHorizontal: 16,
            }}
          >
            <TouchableOpacity onPress={() => setSelectedChats([])}>
              <FontAwesomeIcon
                icon={faArrowLeft}
                size={24}
                color={appStyle.color_on_background}
              />
            </TouchableOpacity>

            <Text
              className="text-2xl font-bold ml-4"
              style={{ color: appStyle.color_on_background }}
            >
              {selectedChats.length}
            </Text>
            <TouchableOpacity onPress={() => deleteSelectedChatsPopup()}>
              <FontAwesomeIcon
                icon={faTrash}
                size={24}
                color={appStyle.color_on_background}
              />
            </TouchableOpacity>
          </View>
        )}
        <View className="flex-1">
          {chatsArr == null ? (
            <Text
              className="text-center text-xl font-semibold m-4"
              style={{ color: appStyle.color_on_background }}
            >
              {languageService[user.language].loading}
            </Text>
          ) : (
            chatsList()
          )}

          <TouchableOpacity
            onPress={showFriends}
            className="rounded-full aspect-square w-16 items-center justify-center absolute"
            style={{
              backgroundColor: appStyle.color_primary,
              right: 16,
              bottom: 40,
            }}
          >
            <FontAwesomeIcon
              icon={faPenToSquare}
              size={40}
              color={appStyle.color_on_primary}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        className="absolute bg-black flex-1 w-full h-full"
        style={{
          display: modalVisible ? "flex" : "none",
          opacity: modalVisible ? 0.8 : 0,
        }}
      ></View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View className="justify-center flex-1">
          <View
            style={{ backgroundColor: appStyle.color_background_variant }}
            className="items-center rounded mx-3 gap-y-2 py-2"
          >
            <Text
              className="font-bold text-xl"
              style={{ color: appStyle.color_on_primary }}
            >
              {languageService[user.language].areYouSure[user.isMale ? 1 : 0]}
            </Text>
            <View className="flex-row w-10/12 justify-between">
              <TouchableOpacity
                className="w-1/3 p-1"
                style={{ backgroundColor: appStyle.color_on_background }}
                onPress={async () => {
                  setModalVisible(!modalVisible);
                  await deleteSelectedChats();
                }}
              >
                <Text
                  className="text-center"
                  style={{ color: appStyle.color_on_primary }}
                >
                  {languageService[user.language].deleteChats}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-1/3 p-1"
                style={{ backgroundColor: appStyle.color_on_background }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setSelectedChats([]);
                }}
              >
                <Text
                  className="text-center"
                  style={{ color: appStyle.color_on_primary }}
                >
                  {languageService[user.language].cancel}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default ChatsScreen;
