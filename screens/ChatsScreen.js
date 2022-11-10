import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { React, useLayoutEffect, useContext, useEffect, useState } from "react";
import ResponsiveStyling from "../components/ResponsiveStyling";
import BottomNavbar from "../components/BottomNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../components/AppStyleSheet";
import authContext from "../context/authContext";
import * as firebase from "../services/firebase";
const ChatsScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(authContext);
  const [chatsArr, setChatArr] = useState(null);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });
  useEffect(() => {
    const getChats = async () => {
      setChatArr(await firebase.getChatsArrayIncludeUsers(user));
      console.log("loaded chats! test2");
      console.log(chatsArr);
    };
    getChats();
  }, []);
  const chatsList = () => {
    return (
      <View>
        <FlatList
          showsHorizontalScrollIndicator={isWeb}
          className="w-auto rounded-lg"
          initialScrollIndex={0.8}
          data={chatsArr}
          keyExtractor={(item) => item.id}
          horizontal
          renderItem={({ item }) => (
            <View
              className="rounded"
              style={{ backgroundColor: appStyle.appAzure }}
            >
              <Text className="text-xl" style={{ color: appStyle.appDarkBlue }}>
                {item.id}
              </Text>
            </View>
          )}
        />
      </View>
    );
  };
  const showFriends = async () => {
    const friendsArr = await firebase.getFriendsArray(user);
    navigation.navigate("Friends", { friendsArray: friendsArr });
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="pt-5 px-5 flex-1">
        <View className="flex-row justify-between">
          <TouchableOpacity>
            <FontAwesomeIcon icon={faBars} size={48} color={appStyle.appGray} />
          </TouchableOpacity>
          <Text
            className="text-5xl font-bold"
            style={{ color: appStyle.appGray }}
          >
            Chats
          </Text>
        </View>
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
          {chatsList()}
          <TouchableOpacity
            className=" m-2"
            style={{ backgroundColor: appStyle.appGray }}
            onPress={() => console.log(chatsArr)}
          >
            <Text className="text-center text-xl">
              Click to see chats in console.log
            </Text>
          </TouchableOpacity>
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
