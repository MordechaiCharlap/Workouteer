import {
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { React, useContext, useEffect, useLayoutEffect, useState } from "react";
import BottomNavbar from "../components/BottomNavbar";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMagnifyingGlass,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import * as firebase from "../services/firebase";
import authContext from "../context/authContext";

const FriendsScreen = ({ route }) => {
  const { user } = useContext(authContext);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  useEffect(() => {
    setShownFriendsArray(route.params.friendsArray);
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
  const openChat = (otherUser) => {
    navigation.navigate("Chat", { user: otherUser });
  };
  const removeFriend = async (userRemoveId) => {
    await firebase.removeFriend(user.usernameLower, userRemoveId);
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-3 px-3 pt-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={30}
              color={appStyle.appGray}
            />
          </TouchableOpacity>
          <Text
            className="text-2xl font-semibold pt-3"
            style={{ color: appStyle.appGray }}
          >
            Friends
          </Text>
          <View className="opacity-0">
            <FontAwesomeIcon icon={faChevronLeft} size={30} />
          </View>
        </View>

        <View
          className="rounded-xl p-3 mx-2"
          style={{ backgroundColor: appStyle.appDarkBlueGrayer }}
        >
          <View className="flex-row items-center">
            <TouchableOpacity onPress={searchClicked}>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                size={20}
                color={appStyle.appDarkBlue}
              />
            </TouchableOpacity>
            <TextInput
              onChangeText={(text) => setSearchText(text)}
              style={{ color: appStyle.appGray }}
              placeholder="Search"
              placeholderTextColor={appStyle.appDarkBlue}
              className="text-xl ml-3"
            />
          </View>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          className="flex-1 px-4 pt-3"
          data={shownFriendsArray}
          keyExtractor={(item) => item.usernameLower}
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
                    style={{ color: appStyle.appGray }}
                  >
                    {item.username}
                  </Text>
                  <Text
                    className="text-md opacity-60 tracking-wider"
                    style={{ color: appStyle.appGray }}
                  >
                    {item.displayName}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openChat(item)}
                className="py-1 px-6 rounded"
                style={{ borderColor: "#707787", borderWidth: 0.5 }}
              >
                <Text
                  className="text-lg font-semibold"
                  style={{ color: appStyle.appGray }}
                >
                  Message
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <BottomNavbar currentScreen="Friends" />
    </SafeAreaView>
  );
};

export default FriendsScreen;
