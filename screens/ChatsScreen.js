import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { React, useState, useCallback } from "react";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCheck,
  faCheckDouble,
  faPenToSquare,
  faArrowLeft,
  faTrash,
  faCheckCircle,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../utils/appStyleSheet";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
import useAlerts from "../hooks/useAlerts";
import AlertDot from "../components/AlertDot";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
import languageService from "../services/languageService";
import { messageTimeString } from "../services/timeFunctions";
import AwesomeModal from "../components/AwesomeModal";
import useResponsiveness from "../hooks/useResponsiveness";
import useChats from "../hooks/useChats";
import Animated from "react-native-reanimated";
const ChatsScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { chats, setChats } = useChats();
  const { setScreen } = useNavbarNavigation();
  const { chatsAlerts } = useAlerts();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChats, setSelectedChats] = useState([]);
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Chats");
      setScreen("Chats");
    }, [])
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
      } else {
        selectedChatsClone.push(item);
      }
      setSelectedChats(selectedChatsClone);
    }
  };
  const deleteSelectedChatsPopup = async () => {
    setModalVisible(true);
  };
  const deleteSelectedChats = async () => {
    const chatsArrClone = chats.slice();
    // Loop through the selectedChats array and remove the corresponding
    // elements from the arr array.
    for (let selectedChat of selectedChats) {
      const index = chatsArrClone.findIndex(
        (arrayItem) => arrayItem.chat.id == selectedChat.chat.id
      );
      chatsArrClone.splice(index, 1);
    }
    setChats(chatsArrClone);
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
      var shownText = lastMessage.content.replace(/[\r\n]+/g, " ");
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
      <Animated.FlatList
        data={chats}
        keyExtractor={(item) => item.chat.id}
        renderItem={({ item, index }) =>
          item.chat.messagesCount > 0 && (
            <TouchableOpacity
              onLongPress={() => chatLongClicked(item)}
              onPress={() => chatClicked(item)}
              className="relative py-2"
              style={[
                {
                  paddingHorizontal: 16,
                },
                index != chats.length - 1 && {
                  borderBottomColor: appStyle.color_outline,
                  borderBottomWidth: 0.3,
                },
              ]}
            >
              <View className="flex-row">
                <View className="h-14 w-14 mr-4">
                  {selectedChats.length > 0 &&
                  selectedChats.some(
                    (selectedItem) => selectedItem.chat.id == item.chat.id
                  ) ? (
                    <View className="absolute h-full w-full justify-center items-center">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        color={appStyle.color_on_background}
                        size={55}
                      />
                    </View>
                  ) : (
                    <Image
                      style={{
                        borderWidth: 0.5,
                        borderColor: appStyle.color_outline,
                      }}
                      source={{
                        uri: item.user.img,
                      }}
                      className="h-full w-full bg-white rounded-full"
                    />
                  )}
                </View>
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
                              color={appStyle.color_on_background}
                              size={15}
                            />
                          </View>
                        ) : (
                          <View className="mr-0.5">
                            <FontAwesomeIcon
                              icon={faCheck}
                              color={appStyle.color_on_background}
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
              </View>
            </TouchableOpacity>
          )
        }
      />
    );
  };
  const showFriends = async () => {
    navigation.navigate("Friends");
  };
  return (
    <View style={safeAreaStyle()}>
      {selectedChats.length == 0 ? (
        <View
          className="flex-row items-center mb-2 justify-center"
          style={{
            paddingVertical: 16,
            borderBottomColor: appStyle.color_outline,
            borderBottomWidth: 0.7,
          }}
        >
          <Text
            className="text-2xl font-semibold"
            style={{ color: appStyle.color_on_background }}
          >
            {languageService[user.language].chats}
          </Text>
          {Object.keys(chatsAlerts).length > 0 && (
            <View
              className="absolute top-0 bottom-0 right-0 justify-center"
              style={{ paddingHorizontal: 16 }}
            >
              <AlertDot
                borderColor={appStyle.color_on_surface_variant}
                borderWidth={0.5}
                text={Object.keys(chatsAlerts).length}
                textColor={appStyle.color_on_surface_variant}
                color={appStyle.color_surface_variant}
                size={35}
              />
            </View>
          )}
        </View>
      ) : (
        <View
          className="flex-row items-center mb-2 justify-between"
          style={{
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderBottomColor: appStyle.color_outline,
            borderBottomWidth: 0.7,
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
        {/* {chats != null && chats.length != 0 && (
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

        <View className="flex-1">
          {chats == null ? (
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
              elevation: 4,
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
      <AwesomeModal
        closeOnTouchOutside={false}
        showModal={modalVisible}
        onDismiss={() => setModalVisible(false)}
        showCancelButton={true}
        onCancelPressed={() => setModalVisible(false)}
        title={languageService[user.language].areYouSure[user.isMale ? 1 : 0]}
        onConfirmPressed={async () => {
          setModalVisible(!modalVisible);
          await deleteSelectedChats();
        }}
        confirmText={languageService[user.language].deleteChats}
      />
    </View>
  );
};
export default ChatsScreen;
