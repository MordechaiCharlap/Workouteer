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
const ExploreScreen = () => {
  const { user } = useContext(authContext);
  const [friendRequests, setFriendRequests] = useState(null);
  const navigation = useNavigation();
  const [renderOption, setRenderOption] = useState("Explore");
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
        friendReqs.forEach((value, key) => {
          const date = new Date(Number(value.timestamp)).toDateString();
          friendsReqsArr.push({
            id: key,
            displayName: value.displayName,
            img: value.img,
            date: date,
          });
        });
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
  const deleteRequestFromArray = (otherUserId) => {
    const index = array.indexOf(otherUserId);
    if (index > -1) {
      array.splice(index, 1);
    }
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
            user={user}
            friendRequests={friendRequests}
            deleteRequest={(otherUserId) => deleteRequestFromArray(otherUserId)}
          />
        )}
        {renderOption == "Explore" && <SearchUsers />}
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
