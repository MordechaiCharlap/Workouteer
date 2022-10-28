import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { React, useLayoutEffect, useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import authContext from "../context/authContext";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import ResponsiveStyling from "../components/ResponsiveStyling";
import FriendRequests from "../components/FriendRequests";
import SearchUsers from "../components/SearchUsers";
import Explore from "../components/Explore";
const ExploreScreen = () => {
  const { user } = useContext(authContext);
  const [friendRequests, setFriendRequests] = useState(null);
  const navigation = useNavigation();
  const [renderOption, setRenderOption] = useState("Explore");
  const [searchInputEmpty, setSearchInputEmpty] = useState(true);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  useEffect(() => {
    if (user.friendRequestCount > 0) {
      const fetchRequests = async () => {
        const friendReqs = await firebase.getReceivedRequests(user);
        var friendsReqsArr = [];
        var index = 0;
        for (var key of friendReqs.keys()) {
          const userData = await firebase.userDataById(key);
          friendsReqsArr.push(userData);
          friendsReqsArr[index].index = index;
          index++;
        }
        setFriendRequests(friendsReqsArr);
      };
      fetchRequests();
      //   const unsub = onSnapshot(
      //     doc(db, "requests", user.usernameLower),
      //     (doc) => {
      //       console.log("Current data: ", doc.data());
      //     }
      //   );
    }
  }, []);
  const deleteRequestFromArray = (index) => {
    const array = friendRequests;
    array.splice(index, 1);
    setFriendRequests(array);
  };
  const userClicked = async (userData) => {
    const friendshipStatus = await firebase.checkFriendShipStatus(
      user,
      userData.usernameLower
    );
    navigation.navigate("User", {
      shownUser: userData,
      friendshipStatus: friendshipStatus,
    });
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1">
        <View className="flex-row justify-between p-3">
          <TouchableOpacity
            onPress={() =>
              renderOption == "Friend requests"
                ? setRenderOption("Explore")
                : setRenderOption("Friend requests")
            }
          >
            <Text
              className="text-2xl w-min bg-gray-500"
              style={style.socialButton}
            >
              Friend requests: {user.friendRequestCount}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text
              className="text-2xl w-min bg-gray-500"
              style={style.socialButton}
            >
              Notifications: {user.notifications?.length || 0}
            </Text>
          </TouchableOpacity>
        </View>
        {renderOption == "Friend requests" && (
          <FriendRequests
            userClicked={userClicked}
            user={user}
            friendRequests={friendRequests}
            deleteRequest={(index) => deleteRequestFromArray(index)}
          />
        )}
        {renderOption == "Explore" && (
          <SearchUsers
            userClicked={userClicked}
            isEmpty={(isEmpty) => setSearchInputEmpty(isEmpty)}
          />
        )}
        {renderOption == "Explore" && searchInputEmpty == true && <Explore />}
      </View>
      <BottomNavbar currentScreen="Explore" />
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  socialButton: {
    borderColor: appStyle.appGray,
    borderWidth: 1,
    color: appStyle.appGray,
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
});
export default ExploreScreen;
