import { Text, TouchableOpacity, View, StatusBar } from "react-native";
import {
  React,
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import responsiveStyle from "../components/ResponsiveStyling";
import SearchUsers from "../components/SearchUsers";
import Explore from "../components/Explore";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCircleUser,
  faPlus,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
const ExploreScreen = () => {
  const navigation = useNavigation();
  const { user, setUser } = useAuth();
  const { setScreen } = useNavbarNavigation();

  const [friendRequests, setFriendRequests] = useState(null);
  const [renderOption, setRenderOption] = useState("Explore");
  const [searchInputEmpty, setSearchInputEmpty] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setScreen("Explore");
    }, [])
  );
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
        if (user.friendRequestsCount > 0) {
          console.log("more than 0 requests: " + user.friendRequestsCount);
          const friendReqs = await firebase.getFriendRequests(user);
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
    setUser(await firebase.updateContext(user.id));
    console.log("updated user requests: " + user.friendRequestsCount);
    const array = friendRequests.slice();
    array.splice(index, 1);
    console.log("deleted item from array");
    setFriendRequests(array);
  };
  const userClicked = async (userData) => {
    const friendshipStatus = await firebase.checkFriendShipStatus(
      user,
      userData.id
    );
    navigation.navigate("User", {
      shownUser: userData,
      friendshipStatus: friendshipStatus,
    });
  };
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View className="flex-1">
        {/* <View className="flex-row px-3 pt-3">
          <TouchableOpacity
            style={{ backgroundColor: appStyle.color_primary }}
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
                color={appStyle.color_on_primary}
              />
              <View
                style={{ backgroundColor: appStyle.color_primary }}
                className="rounded-full items-center absolute right-0 bottom-0"
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  size={13}
                  color={appStyle.color_on_primary}
                />
              </View>
            </View>
            <Text
              className="text-2xl w-min font-bold"
              style={{ color: appStyle.color_on_primary }}
            >
              {user.friendRequestsCount}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: appStyle.color_primary }}
            className="flex-row items-center rounded p-2"
          >
            <FontAwesomeIcon
              icon={faBell}
              size={35}
              color={appStyle.color_on_primary}
            />
            <Text
              className="text-2xl w-min font-bold"
              style={{ color: appStyle.color_on_primary }}
            >
              {user.notificationsCount ? user.notificationsCount : 0}
            </Text>
          </TouchableOpacity>
        </View> */}
        {/* {renderOption == "Friend requests" && (
          <FriendRequests
            userClicked={userClicked}
            user={user}
            friendRequests={friendRequests}
            deleteRequest={(otherUserId) => deleteRequestFromArray(otherUserId)}
          />
        )} */}
        {renderOption == "Explore" && (
          <SearchUsers
            userClicked={userClicked}
            isEmpty={(isEmpty) => setSearchInputEmpty(isEmpty)}
          />
        )}
        {renderOption == "Explore" && searchInputEmpty == true && <Explore />}
      </View>
      <BottomNavbar currentScreen="Explore" />
    </View>
  );
};
export default ExploreScreen;
