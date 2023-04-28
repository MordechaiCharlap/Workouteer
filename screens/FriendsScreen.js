import {
  StatusBar,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { React, useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as appStyle from "../utilities/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMagnifyingGlass,
  faChevronLeft,
  faCircleUser,
  faUserClock,
} from "@fortawesome/free-solid-svg-icons";
import * as firebase from "../services/firebase";
import AlertDot from "../components/AlertDot";
import useAuth from "../hooks/useAuth";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import languageService from "../services/languageService";
const FriendsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Friends");
      const showFriends = async () => {
        const friendsArr = [];
        for (var key of Object.keys(
          isMyUser ? user.friends : shownUser.friends
        )) {
          var userData = await firebase.userDataById(key);
          friendsArr.push(userData);
        }
        setFriendsArray(friendsArr);
        setShownFriendsArray(friendsArr);
      };
      showFriends();
    }, [])
  );
  const { user } = useAuth();
  const shownUser = route.params.user;
  const isMyUser = route.params.isMyUser;
  const [searchText, setSearchText] = useState("");
  const [friendsArray, setFriendsArray] = useState();
  const [shownFriendsArray, setShownFriendsArray] = useState([]);
  useEffect(() => {
    if (searchText != "") {
      const searchTextLower = searchText.toLocaleLowerCase();
      const resultArray = [];
      for (var i = 0; i < friendsArray.length; i++) {
        if (
          friendsArray[i].id.toLocaleLowerCase().includes(searchTextLower) ||
          friendsArray[i].displayName
            .toLocaleLowerCase()
            .includes(searchTextLower)
        ) {
          resultArray.push(friendsArray[i]);
        }
      }
      setShownFriendsArray(resultArray);
    } else setShownFriendsArray(friendsArray);
  }, [searchText]);
  //TODO
  const openPrivateChat = async (otherUser) => {
    const chat = await firebase.getPrivateChatByUsers(user, otherUser);
    navigation.navigate("Chat", { otherUser: otherUser, chat: chat });
  };
  return (
    <View style={safeAreaStyle()}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View className="flex-1 px-2">
        <View
          className="flex-row items-center mt-4 mb-4"
          style={{
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={40}
              color={appStyle.color_primary}
            />
          </TouchableOpacity>
          <Text
            className={
              Platform.OS == "web"
                ? "text-2xl font-semibold"
                : "text-4xl font-semibold"
            }
            style={{ color: appStyle.color_primary }}
          >
            {languageService[user.language].friends}
          </Text>
          <FontAwesomeIcon
            icon={faCircleUser}
            size={40}
            color={appStyle.color_bg}
          />
          {isMyUser && user.friendRequestsCount > 0 && (
            <TouchableOpacity
              onPress={() => navigation.navigate("FriendRequests")}
              className="flex-row p-2 items-center rounded-xl absolute right-0"
              style={{ backgroundColor: appStyle.color_primary }}
            >
              <AlertDot
                text={user.friendRequestsCount}
                textColor={appStyle.color_bg}
                fontSize={17}
                borderColor={appStyle.color_bg}
                borderWidth={1}
                size={43}
                color={appStyle.color_primary}
              />
              <View className="ml-2">
                <FontAwesomeIcon
                  icon={faUserClock}
                  size={40}
                  color={appStyle.color_bg}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View
          className="rounded-xl p-3"
          style={{ backgroundColor: appStyle.color_bg_variant }}
        >
          <View
            className={`items-center gap-x-1 flex-row${
              user.language == "hebrew" ? "-reverse" : ""
            }`}
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size={20}
              color={appStyle.color_primary}
            />
            <TextInput
              onChangeText={(text) => setSearchText(text)}
              style={{ color: appStyle.color_on_primary }}
              placeholder={languageService[user.language].search}
              placeholderTextColor={appStyle.color_primary}
              className="text-xl"
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
                    friendshipStatus: isMyUser
                      ? "Friends"
                      : firebase.checkFriendShipStatus(user, item),
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
                    {item.id}
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
                  {languageService[user.language].message[user.isMale ? 1 : 0]}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
        {isMyUser && (
          <View
            className="items-center"
            style={{ backgroundColor: appStyle.color_bg }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("SearchUsers")}
              className="m-3 py-3 px-8"
              style={{ backgroundColor: appStyle.color_primary }}
            >
              <Text style={{ color: appStyle.color_on_primary }}>
                {languageService[user.language].addANewFriend}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default FriendsScreen;
