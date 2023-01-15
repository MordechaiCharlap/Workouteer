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
  useEffect(() => {}, []);
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
