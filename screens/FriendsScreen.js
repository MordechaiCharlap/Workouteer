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
import { React, useEffect, useLayoutEffect, useState } from "react";
import BottomNavbar from "../components/BottomNavbar";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMagnifyingGlass,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

const FriendsScreen = ({ route }) => {
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
      allFriendsMap.forEach((value, key) => {
        friendsArr.push(key);
      });
      setShownFriendsArray(friendsArr);
    }
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
          className="flex-1 p-3"
          data={shownFriendsArray}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex-row justify-between items-center mt-2">
              <View className="flex-row items-center">
                <Image
                  source={{
                    uri: item.img,
                  }}
                  className="h-16 w-16 bg-white rounded-full mr-4"
                />
                <View>
                  <Text
                    className="text-xl font-semibold"
                    style={{ color: appStyle.appGray }}
                  >
                    {item.username}
                  </Text>
                  <Text
                    className="text-md opacity-60"
                    style={{ color: appStyle.appGray }}
                  >
                    {item.displayName}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="py-2 px-6 rounded"
                style={{ backgroundColor: appStyle.appAzure }}
              >
                <Text
                  className="text-xl font-semibold"
                  style={{ color: appStyle.appGray }}
                >
                  Remove
                </Text>
              </TouchableOpacity>
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
