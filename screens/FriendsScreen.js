import {
  StatusBar,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { React, useEffect, useLayoutEffect, useState } from "react";
import BottomNavbar from "../components/BottomNavbar";
import { useNavigation } from "@react-navigation/native";
import responsiveStyle from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import * as firebase from "../services/firebase";
import Header from "../components/Header";

const FriendsScreen = ({ route }) => {
  const user = route.params.user;
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  useEffect(() => {
    const showFriends = async () => {
      const friendsArr = [];
      for (var key of Object.keys(user.friends)) {
        var userData = await firebase.userDataById(key);
        friendsArr.push(userData);
      }
      setShownFriendsArray(friendsArr);
    };
    showFriends();
  }, []);

  const [searchText, setSearchText] = useState("");
  const [shownFriendsArray, setShownFriendsArray] = useState([]);

  const searchClicked = async () => {
    if (searchText != "") {
      const friendsArr = [];
      //TODO!!
      // allFriendsMap.forEach((value, key) => {
      //   friendsArr.push(key);
      // });
      // setShownFriendsArray(friendsArr);
    }
  };
  //TODO
  const openPrivateChat = async (otherUser) => {
    const chat = await firebase.getPrivateChatByUsers(user, otherUser);
    navigation.navigate("Chat", { otherUser: otherUser, chat: chat });
  };
  const removeFriend = async (userRemoveId) => {
    await firebase.removeFriend(user.id, userRemoveId);
  };
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View className="flex-1">
        <Header title="Friends" goBackOption={true} />
        <View
          className="rounded-xl p-3 mx-2"
          style={{ backgroundColor: appStyle.color_bg_variant }}
        >
          <View className="flex-row items-center">
            <TouchableOpacity onPress={searchClicked}>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                size={20}
                color={appStyle.color_primary}
              />
            </TouchableOpacity>
            <TextInput
              onChangeText={(text) => setSearchText(text)}
              style={{ color: appStyle.appGray }}
              placeholder="Search"
              placeholderTextColor={appStyle.color_primary}
              className="text-xl ml-3"
            />
          </View>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          className="flex-1 px-4 pt-3"
          data={shownFriendsArray}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex-row items-center mt-2">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("User", {
                    shownUser: item,
                    friendshipStatus: "Friends",
                  })
                }
                className="flex-row flex-1 items-center"
              >
                <Image
                  source={{
                    uri: item.img,
                  }}
                  className="h-14 w-14 bg-white rounded-full mr-4"
                />
                <View>
                  <Text
                    className="text-xl font-semibold tracking-wider"
                    style={{ color: appStyle.color_primary }}
                  >
                    {item.username}
                  </Text>
                  <Text
                    className="text-md opacity-60 tracking-wider"
                    style={{ color: appStyle.color_primary }}
                  >
                    {item.displayName}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openPrivateChat(item)}
                className="py-1 px-6 rounded"
                style={{
                  backgroundColor: appStyle.color_bg,
                  borderColor: appStyle.color_primary,
                  borderWidth: 0.5,
                }}
              >
                <Text
                  className="text-lg font-semibold"
                  style={{ color: appStyle.color_primary }}
                >
                  Message
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <BottomNavbar currentScreen="Friends" />
    </View>
  );
};

export default FriendsScreen;
