import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Text,
  Platform,
} from "react-native";
import { React, useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as appStyle from "../utils/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMagnifyingGlass,
  faChevronLeft,
  faCircleUser,
  faUserClock,
  faPaperPlane,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import * as firebase from "../services/firebase";
import AlertDot from "../components/AlertDot";
import useAuth from "../hooks/useAuth";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import languageService from "../services/languageService";
import CustomButton from "../components/basic/CustomButton";
import Header from "../components/Header";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
const FriendsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();
  const { user } = useAuth();
  var shownUser = route.params.user ? route.params.user : user;
  const isMyUser = shownUser.id == user.id;
  const [searchText, setSearchText] = useState("");
  const [friendsArray, setFriendsArray] = useState();
  const [shownFriendsArray, setShownFriendsArray] = useState([]);
  const listOpacity = useSharedValue(0);
  const listMarginTop = useSharedValue(50);
  const animatedListStyle = useAnimatedStyle(() => {
    return {
      opacity: listOpacity.value,
      marginTop: listMarginTop.value,
    };
  }, []);
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Friends");
    }, [])
  );
  useEffect(() => {
    const showFriends = async () => {
      if (!isMyUser) {
        return;
      }
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
  }, [user.friends]);
  useEffect(() => {
    if (friendsArray) {
      listMarginTop.value = withTiming(0, { duration: 500 });
      listOpacity.value = withTiming(1, { duration: 500 });
    }
  }, [friendsArray]);
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
      <View className="flex-1 px-2">
        <Header
          title={languageService[user.language].friends}
          goBackOption={true}
        >
          {isMyUser && user.friendRequestsCount > 0 && (
            <TouchableOpacity
              onPress={() => navigation.navigate("FriendRequests")}
              className="flex-row py-2 px-4 items-center rounded-full absolute right-0"
              style={{ backgroundColor: appStyle.color_surface_variant }}
            >
              <FontAwesomeIcon
                icon={faUserClock}
                size={40}
                color={appStyle.color_on_surface_variant}
              />
              <View className="absolute left-0 bottom-0">
                <AlertDot
                  text={user.friendRequestsCount}
                  textColor={appStyle.color_on_primary_container}
                  fontSize={15}
                  borderColor={appStyle.color_background}
                  borderWidth={1}
                  size={25}
                  color={appStyle.color_primary_container}
                />
              </View>
            </TouchableOpacity>
          )}
        </Header>

        <View
          className="rounded-xl p-3"
          style={{ backgroundColor: appStyle.color_surface_variant }}
        >
          <View
            className={`items-center gap-x-1 flex-row${
              user.language == "hebrew" ? "-reverse" : ""
            }`}
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size={20}
              color={appStyle.color_on_background}
            />
            <TextInput
              onChangeText={(text) => setSearchText(text)}
              placeholder={languageService[user.language].search}
              style={{ flex: 1 }}
              className="text-xl"
            />
          </View>
        </View>
        <Animated.FlatList
          style={[animatedListStyle]}
          showsVerticalScrollIndicator={false}
          className="flex-1 px-4 pt-3"
          data={shownFriendsArray}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex-row items-center mt-2">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Profile", {
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
                    style={{ color: appStyle.color_on_background }}
                  >
                    {item.id}
                  </Text>
                  <Text
                    className="text-md opacity-60 tracking-wider"
                    style={{ color: appStyle.color_on_background }}
                  >
                    {item.displayName}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openPrivateChat(item)}
                className="p-2 rounded items-center justify-center flex-row gap-x-1"
                style={{
                  backgroundColor: appStyle.color_surface_variant,
                }}
              >
                <Text style={{ color: appStyle.color_on_surface_variant }}>
                  {languageService[user.language].message[user.isMale ? 1 : 0]}
                </Text>
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  size={15}
                  color={appStyle.color_on_surface_variant}
                />
              </TouchableOpacity>
            </View>
          )}
        />
        {isMyUser && (
          <View
            className="items-center"
            style={{ backgroundColor: appStyle.color_background }}
          >
            <CustomButton
              onPress={() => navigation.navigate("SearchUsers")}
              className="m-3 flex-row"
              outline
              style={{
                backgroundColor: appStyle.color_surface,
              }}
            >
              <FontAwesomeIcon
                icon={faUserPlus}
                color={appStyle.color_primary}
                size={25}
              />
              <View style={{ width: 10 }} />
              <Text style={{ color: appStyle.color_on_surface }}>
                {languageService[user.language].addANewFriend}
              </Text>
            </CustomButton>
          </View>
        )}
      </View>
    </View>
  );
};

export default FriendsScreen;
