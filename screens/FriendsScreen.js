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
import LoadingAnimation from "../components/LoadingAnimation";
import appComponentsDefaultStyles from "../utils/appComponentsDefaultStyles";
import useFriendRequests from "../hooks/useFriendRequests";
import CustomText from "../components/basic/CustomText";
const FriendsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();
  const { user } = useAuth();
  const [shownUser, setShownUser] = useState(route?.params?.shownUser || user);
  const [isMyUser, setIsMyUser] = useState(shownUser.id == user.id);
  const [searchText, setSearchText] = useState("");
  const [friendsArray, setFriendsArray] = useState();
  const [shownFriendsArray, setShownFriendsArray] = useState();
  const { receivedFriendRequests } = useFriendRequests();
  useEffect(() => {
    setShownUser(route?.params?.shownUser || user);
    setIsMyUser(route?.params?.shownUser?.id == user.id);
  }, [route?.params?.shownUser]);
  useEffect(() => {
    if (!shownFriendsArray) return;
    listMarginTop.value = withTiming(0);
    listOpacity.value = withTiming(1);
  }, [shownFriendsArray]);
  const listOpacity = useSharedValue(0);
  const listMarginTop = useSharedValue(25);
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
    if (!isMyUser) {
      refreshFriendsArray();
    }
  }, [shownUser, isMyUser]);
  useEffect(() => {
    if (isMyUser) refreshFriendsArray();
  }, [user.friends]);

  useEffect(() => {
    if (!friendsArray) return;
    if (searchText != "") {
      const searchTextLower = searchText.toLowerCase();
      const resultArray = [];
      for (var i = 0; i < friendsArray.length; i++) {
        if (
          friendsArray[i].id.toLowerCase().includes(searchTextLower) ||
          friendsArray[i].displayName.toLowerCase().includes(searchTextLower)
        ) {
          resultArray.push(friendsArray[i]);
        }
      }
      setShownFriendsArray(resultArray);
    } else {
      setShownFriendsArray(friendsArray);
    }
  }, [searchText, friendsArray]);
  //TODO
  const openPrivateChat = async (otherUser) => {
    const chat = await firebase.getPrivateChatByUsers(user, otherUser);
    navigation.navigate("Chat", { otherUser: otherUser, chat: chat });
  };
  const refreshFriendsArray = async () => {
    const newFriendsArray = [];
    for (var friendId of Object.keys(shownUser.friends)) {
      if (newFriendsArray.findIndex((friend) => friend.id == friendId) != -1)
        continue;
      var userData = await firebase.userDataById(friendId);
      newFriendsArray.push(userData);
    }
    setFriendsArray(newFriendsArray);
  };
  return (
    <View style={safeAreaStyle()}>
      <View className="flex-1 px-2">
        <Header
          title={languageService[user.language].friends}
          goBackOption={true}
        >
          {isMyUser &&
            receivedFriendRequests &&
            Object.keys(receivedFriendRequests).length > 0 && (
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
                    text={Object.keys(receivedFriendRequests).length}
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
        {Object.keys(user.friends).length == 0 ? (
          <View className="flex-1 justify-center">
            <View
              className="items-center justify-center"
              style={[
                {
                  marginTop: 10,
                  marginHorizontal: 16,
                  padding: 6,
                  borderRadius: 16,
                  backgroundColor: appStyle.color_surface,
                  borderWidth: 0.5,
                  borderColor: appStyle.color_outline,
                },
                appComponentsDefaultStyles.shadow,
              ]}
            >
              <CustomText className="text-2xl font-semibold">
                {languageService[user.language].youHaventAddedFriendsYet}
              </CustomText>
            </View>
          </View>
        ) : (
          <View className="flex-1">
            {!friendsArray ? (
              <LoadingAnimation />
            ) : (
              <Animated.FlatList
                style={[
                  {
                    paddingTop: 10,
                  },
                  animatedListStyle,
                ]}
                // showsVerticalScrollIndicator={false}
                contentContainerStyle={{ rowGap: 10 }}
                className="flex-1"
                data={shownFriendsArray}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      onPress={() => {
                        item.id == user.id
                          ? navigation.navigate("MyProfile")
                          : navigation.navigate("Profile", {
                              shownUser: item,
                            });
                      }}
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
                      <Text
                        style={{ color: appStyle.color_on_surface_variant }}
                      >
                        {
                          languageService[user.language].message[
                            user.isMale ? 1 : 0
                          ]
                        }
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
            )}
          </View>
        )}
        {isMyUser && (
          <CustomButton
            onPress={() => navigation.navigate("SearchUsers")}
            className="m-3 flex-row self-center absolute bottom-3"
            outline
            style={[
              {
                backgroundColor: appStyle.color_surface,
              },
              appComponentsDefaultStyles.shadow,
            ]}
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
        )}
      </View>
    </View>
  );
};

export default FriendsScreen;
