import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
} from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import responsiveStyle from "../components/ResponsiveStyling";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
const InviteFriendsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const membersArray = route.params.membersArray;
  const requestersArray = route.params.requestersArray;
  const [invitedArray, setInvitedArray] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [shownFriendsArray, setShownFriendsArray] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const showFriends = async () => {
        const allFriendsMap = new Map(Object.entries(user.friends));
        const friendsArr = [];
        for (var key of allFriendsMap.keys()) {
          var userData = await firebase.userDataById(key);
          console.log(userData.usernameLower);
          friendsArr.push(userData);
        }
        setShownFriendsArray(friendsArr);
      };
      showFriends();
    }, [])
  );
  const inviteFriend = async (friend) => {};
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Header title={"Invite Friends"} goBackOption={true} />
      <View
        className="rounded-xl p-3 mx-2"
        style={{ backgroundColor: appStyle.color_bg_variant }}
      >
        <View className="flex-row items-center">
          <TouchableOpacity>
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
        keyExtractor={(item) => item.usernameLower}
        renderItem={({ item }) => (
          <View className="flex-row items-center mt-2">
            <TouchableOpacity className="flex-row flex-1 items-center">
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
                Invite
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default InviteFriendsScreen;
