import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { React, useLayoutEffect, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import authContext from "../context/authContext";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import ResponsiveStyling from "../components/ResponsiveStyling";
import FriendRequests from "../components/FriendRequests";
import SearchUsers from "../components/SearchUsers";
import Explore from "../components/Explore";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCircleUser,
  faPlus,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
const ExploreScreen = () => {
  const { user, setUser } = useAuth();
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
    if (renderOption == "Explore") {
      console.log("using effectionn <3");
      const fetchRequests = async () => {
        var friendsReqsArr = [];
        if (user.friendRequestCount > 0) {
          console.log("more than 0 requests: " + user.friendRequestCount);
          const friendReqs = await firebase.getReceivedRequests(user);
          for (var key of friendReqs.keys()) {
            const userData = await firebase.userDataById(key);
            friendsReqsArr.push(userData);
          }
        } else {
          console.log("0 requests");
        }
        setFriendRequests(friendsReqsArr);
        console.log(friendsReqsArr);
      };
      fetchRequests();
    }
  }, [renderOption]);
  const deleteRequestFromArray = async (index) => {
    setUser(await firebase.updateContext(user.usernameLower));
    console.log("updated user requests: " + user.friendRequestCount);
    const array = friendRequests.slice();
    array.splice(index, 1);
    console.log("deleted item from array");
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
        <View className="flex-row px-3 pt-3">
          <TouchableOpacity
            style={{ backgroundColor: appStyle.appLightBlue }}
            className="flex-row items-center rounded mr-3 p-2"
            onPress={() =>
              renderOption == "Friend requests"
                ? setRenderOption("Explore")
                : setRenderOption("Friend requests")
            }
          >
            <View className="mr-2">
              <FontAwesomeIcon
                icon={faCircleUser}
                size={35}
                color={appStyle.appDarkBlue}
              />
              <View
                style={{ backgroundColor: appStyle.appLightBlue }}
                className="rounded-full items-center absolute right-0 bottom-0"
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  size={13}
                  color={appStyle.appDarkBlue}
                />
              </View>
            </View>
            <Text
              className="text-2xl w-min font-bold"
              style={{ color: appStyle.appDarkBlue }}
            >
              {user.friendRequestCount}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: appStyle.appLightBlue }}
            className="flex-row items-center rounded p-2"
          >
            <FontAwesomeIcon
              icon={faBell}
              size={35}
              color={appStyle.appDarkBlue}
            />
            <Text
              className="text-2xl w-min font-bold"
              style={{ color: appStyle.appDarkBlue }}
            >
              {user.notificationsCount}
            </Text>
          </TouchableOpacity>
        </View>
        {renderOption == "Friend requests" && (
          <FriendRequests
            userClicked={userClicked}
            user={user}
            friendRequests={friendRequests}
            deleteRequest={(otherUserId) => deleteRequestFromArray(otherUserId)}
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
export default ExploreScreen;
