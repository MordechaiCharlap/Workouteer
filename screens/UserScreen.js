import {
  Image,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { React, useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import ResponsiveStyling from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import * as firebase from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import authContext from "../context/authContext";
const UserScreen = ({ route }) => {
  const { user } = useContext(authContext);
  const db = firebase.db;
  const shownUser = route.params.shownUser;
  const navigation = useNavigation();

  const [friendshipStatus, setFriendshipStatus] = useState("None");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    friendshipStatusInit();
  }, []);

  const friendshipStatusInit = async () => {
    const friendsMap = new Map(Object.entries(user.friends));
    if (friendsMap.has(shownUser.usernameLower)) {
      setFriendshipStatus("Friends");
    } else {
      const userReqDoc = await getDoc(doc(db, "requests", user.usernameLower));
      const ownReqMap = new Map(Object.entries(userReqDoc.data().ownRequests));
      if (ownReqMap.has(shownUser.usernameLower)) {
        setFriendshipStatus("SentRequest");
      } else {
        const othersReqMap = new Map(
          Object.entries(userReqDoc.data().othersRequests)
        );
        if (othersReqMap.has(shownUser.usernameLower)) {
          setFriendshipStatus("GotRequest");
        }
      }
    }
    console.log(`Friendship status: ${friendshipStatus}`);
  };

  const removeFriend = async () => {};
  const acceptFriendRequest = async () => {};
  const rejectFriendRequest = async () => {};
  const cancelFriendRequest = async () => {
    setFriendshipStatus("None");
    await firebase.cancelFriendRequest(user, shownUser);
  };
  const sendFriendRequest = async () => {
    setFriendshipStatus("SentRequest");
    await firebase.sendFriendRequest(user, shownUser);
  };
  const calculateAge = () => {
    const birthdate = shownUser.birthdate.toDate();
    var today = new Date();
    var age = today.getFullYear() - birthdate.getFullYear();
    var m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    return age;
  };
  const renderFriendshipButton = () => {
    if (friendshipStatus == "None")
      return (
        <TouchableOpacity
          onPress={sendFriendRequest}
          style={style.socialButton}
        >
          <Text
            className="text-center text-xl"
            style={{ color: appStyle.appGray }}
          >
            Add as a friend
          </Text>
        </TouchableOpacity>
      );
    else if (friendshipStatus == "Friends")
      return (
        <TouchableOpacity onPress={removeFriend} style={style.socialButton}>
          <Text
            className="text-center text-xl"
            style={{ color: appStyle.appGray }}
          >
            Remove from friends
          </Text>
        </TouchableOpacity>
      );
    else if (friendshipStatus == "SentRequest")
      return (
        <TouchableOpacity
          onPress={cancelFriendRequest}
          style={style.socialButton}
        >
          <Text
            className="text-center text-xl"
            style={{ color: appStyle.appGray }}
          >
            Cancel friend request
          </Text>
        </TouchableOpacity>
      );
    else if (friendshipStatus == "GotRequest")
      return (
        <View className="flex-row">
          <TouchableOpacity
            onPress={rejectFriendRequest}
            style={style.socialButton}
          >
            <Text
              className="text-center text-xl"
              style={{ color: appStyle.appGray }}
            >
              Reject
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={acceptFriendRequest}
            style={style.socialButton}
          >
            <Text
              className="text-center text-xl"
              style={{ color: appStyle.appGray }}
            >
              Accept
            </Text>
          </TouchableOpacity>
          <Text
            className="text-center text-xl"
            style={{ color: appStyle.appGray }}
          >
            Friend request
          </Text>
        </View>
      );
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1 p-3">
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={30}
              color={appStyle.appGray}
            />
          </TouchableOpacity>
        </View>
        <Image
          source={{
            uri: shownUser.img,
          }}
          className="h-60 w-60 bg-white rounded-full mb-2 self-center"
        />
        <Text
          className="font-semibold text-4xl self-center"
          style={{
            color: appStyle.appGray,
          }}
        >
          {shownUser.username}
        </Text>
        <Text
          className="self-center font-bold text-xl tracking-wider"
          style={{ color: appStyle.appGray }}
        >
          {shownUser.firstName} {shownUser.lastName}, {calculateAge()}
        </Text>

        <View
          className="flex-row justify-around"
          style={style.workoutAndFriends}
        >
          <View className="items-center">
            <Text style={style.text} className="font-bold">
              {shownUser.workoutsCount}
            </Text>
            <Text style={style.text}>Workouts</Text>
          </View>
          <View className="items-center">
            <Text style={style.text} className="font-bold">
              {shownUser.friendsCount}
            </Text>
            <Text style={style.text}>Friends</Text>
          </View>
        </View>
        <View className="flex-row items-center self-center">
          {renderFriendshipButton()}
          {(shownUser.isPublic == true || friendshipStatus == "Friends") && (
            <TouchableOpacity
              onPress={sendFriendRequest}
              style={style.socialButton}
            >
              <Text
                className="text-center text-xl"
                style={{ color: appStyle.appGray }}
              >
                Send a message
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <BottomNavbar currentScreen="User" />
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  text: {
    fontSize: 20,
    color: appStyle.appGray,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: appStyle.appGray,
    padding: 4,
    margin: 10,
    borderRadius: 5,
  },
});
export default UserScreen;
