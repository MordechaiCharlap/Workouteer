import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
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
import { ResponsiveShadow } from "../components/ResponsiveStyling";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMagnifyingGlass,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import authContext from "../context/authContext";
import * as firebase from "../services/firebase";
const FriendsScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const [searchText, setSearchText] = useState("");
  const { user } = useContext(authContext);
  const [shownFriendsArray, setShownFriendsArray] = useState([]);
  const allFriendsMap = new Map(Object.entries(user.friends));

  useEffect(() => {
    const showAllFriends = async () => {
      const friendsArr = [];
      for (var [value, key] of allFriendsMap) {
        var userData = await firebase.userDataById(key);
        console.log(userData);
        friendsArr.push({
          id: key,
          username: userData.username,
          displayName: userData.displayName,
          img: userData.img,
        });
      }
      console.log(friendsArr);
      setShownFriendsArray(friendsArr);
    };
    showAllFriends();
  }, []);

  const searchClicked = async () => {
    if (searchText != "") {
      const friendsArr = [];
      allFriendsMap.forEach((value, key) => {
        friendsArr.push(key);
      });
      setShownFriendsArray(friendsArr);
    }
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1 p-2">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={30}
              color={appStyle.appGray}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: appStyle.appLightBlue }}
            className="rounded-sm items-center justify-center px-2"
            onPress={() => navigation.navigate("SearchUsers")}
          >
            <Text className="text-xl font-bold">New friend</Text>
          </TouchableOpacity>
        </View>
        <Text
          className="text-5xl font-bold text-center mt-5"
          style={{ color: appStyle.appGray }}
        >
          Friends
        </Text>
        <View
          className="rounded-xl mt-4 p-3"
          style={{ backgroundColor: appStyle.appDarkBlueGrayer }}
        >
          <View className="flex-row items-center">
            <TouchableOpacity onPress={searchClicked}>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                size={24}
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
          className="flex-1 "
          data={shownFriendsArray}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Image
                  source={{
                    uri: item.img,
                  }}
                  className="h-16 w-16 bg-white rounded-full mr-2"
                />
                <Text className="text-xl" style={{ color: appStyle.appGray }}>
                  {item.displayName}
                </Text>
              </View>
            </View>
          )}
        />
        {/* <FlatList
          showsVerticalScrollIndicator={false}
          className="flex-1 "
          data={shownFriendsArray}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: appStyle.appLightBlue,
                marginTop: 1,
              }}
              className={`p-2 h-16 flex-row ${ResponsiveShadow}`}
            >
              <View className="items-center aspect-square">
                <Image
                  source={{
                    uri: item.img,
                  }}
                  className="h-16 w-16 rounded-full bg-white aspect-square"
                  // style={style.profileImg}
                />
              </View>
              <View className="justify-center" style={{ flexBasis: "76%" }}>
                <Text
                  className="text-xl font-semibold text-center"
                  style={{ color: appStyle.appDarkBlue }}
                >
                  {item.username}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        /> */}
      </View>
      <BottomNavbar currentScreen="Friends" />
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  profileImg: {
    borderColor: appStyle.appDarkBlue,
    borderWidth: 0.1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0 /* Make the picture taking the size of it's parent */,
    // width: "100%" /* This if for the object-fit */,
    width: "100%" /* This if for the object-fit */,
    objectFit:
      "cover" /* Equivalent of the background-size: cover; of a background-image */,
    objectPosition: "center",
  },
});
export default FriendsScreen;
