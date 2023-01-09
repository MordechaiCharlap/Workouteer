import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { React, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import responsiveStyle from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
const UserScreen = ({ route }) => {
  const { user } = useAuth();
  const shownUser = route.params.shownUser;
  const navigation = useNavigation();
  const [workoutsCount, setWorkoutsCount] = useState();
  const [friendshipStatus, setFriendshipStatus] = useState(
    route.params.friendshipStatus
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  useEffect(() => {
    const workouts = new Map(Object.entries(shownUser.workouts));
    const now = new Date();
    var count = 0;
    for (var value of workouts.values()) {
      if (value.toDate() < now) count++;
    }
    setWorkoutsCount(count);
  }, []);
  const openPrivateChat = async () => {
    const chat = await firebase.getPrivateChatByUsers(user, shownUser);
    navigation.navigate("Chat", { otherUser: shownUser, chat: chat });
  };
  const removeFriend = async () => {
    setFriendshipStatus("None");
    await firebase.removeFriend(user.usernameLower, shownUser.usernameLower);
  };
  const acceptFriendRequest = async () => {};
  const rejectFriendRequest = async () => {};
  const cancelFriendRequest = async () => {
    setFriendshipStatus("None");
    await firebase.cancelFriendRequest(
      user.usernameLower,
      shownUser.usernameLower
    );
  };
  const sendFriendRequest = async () => {
    setFriendshipStatus("SentRequest");
    await firebase.sendFriendRequest(user.usernameLower, shownUser);
  };
  const calculateAge = () => {
    console.log(shownUser.birthdate);
    const birthdate = shownUser.birthdate.toDate();
    var today = new Date();
    var age = today.getFullYear() - birthdate.getFullYear();
    var m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    return age;
  };
  const showOtherUserFriends = () => {};
  const renderFriendshipButton = () => {
    if (friendshipStatus == "None")
      return (
        <TouchableOpacity
          onPress={sendFriendRequest}
          style={style.socialButton}
        >
          <Text
            className="text-center text-xl"
            style={{ color: appStyle.color_primary }}
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
            style={{ color: appStyle.color_primary }}
          >
            Remove friend
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
            style={{ color: appStyle.color_primary }}
          >
            Cancel friend request
          </Text>
        </TouchableOpacity>
      );
    else if (friendshipStatus == "ReceivedRequest")
      return (
        <View className="flex-row items-center">
          <TouchableOpacity
            className="rounded-l"
            onPress={rejectFriendRequest}
            style={style.leftSocialButton}
          >
            <Text className="text-center text-xl" style={style.leftText}>
              Accept
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-r"
            onPress={acceptFriendRequest}
            style={style.rightSocialButton}
          >
            <Text className="text-center text-xl" style={style.rightText}>
              Reject
            </Text>
          </TouchableOpacity>
        </View>
      );
  };
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View className="flex-1">
        <ScrollView>
          <View className="p-4">
            <View className="flex-row justify-between">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  size={30}
                  color={appStyle.color_primary}
                />
              </TouchableOpacity>
              <Text
                className=" text-center text-3xl tracking-widest"
                style={{ color: appStyle.color_primary }}
              >
                {shownUser.username}
              </Text>
              <View className="opacity-0">
                <FontAwesomeIcon icon={faChevronLeft} size={30} />
              </View>
            </View>
            <View className="flex-row mt-6 mb-3">
              <Image
                source={{
                  uri: shownUser.img,
                }}
                className="h-32 w-32 bg-white rounded-full mb-2 self-center"
              />
              <View className="flex-row flex-1 justify-around">
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("PastWorkouts", { user: shownUser })
                    }
                    className="items-center"
                  >
                    <Text
                      style={{ fontSize: 20, color: appStyle.color_primary }}
                      className="font-bold"
                    >
                      {workoutsCount}
                    </Text>
                    <Text
                      style={{ fontSize: 20, color: appStyle.color_primary }}
                    >
                      Workouts
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    className="items-center"
                    onPress={showOtherUserFriends}
                  >
                    <Text
                      style={{ fontSize: 20, color: appStyle.color_primary }}
                    >
                      {shownUser.friendsCount}
                    </Text>
                    <Text
                      style={{ fontSize: 20, color: appStyle.color_primary }}
                    >
                      Friends
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Text
              className="font-semibold text-2xl mb-5"
              style={{
                color: appStyle.color_primary,
              }}
            >
              {shownUser.displayName}
            </Text>
            <Text style={{ color: appStyle.color_primary }} className="text-lg">
              {shownUser.description == ""
                ? "No description yet"
                : shownUser.description}
            </Text>
            <View className="flex-row items-center self-center justify-around">
              {renderFriendshipButton()}
              {(shownUser.isPublic == true ||
                friendshipStatus == "Friends") && (
                <TouchableOpacity
                  onPress={() => openPrivateChat()}
                  style={style.socialButton}
                >
                  <Text
                    className="text-center text-xl"
                    style={{ color: appStyle.color_primary }}
                  >
                    Send a message
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
      <BottomNavbar currentScreen="User" />
    </View>
  );
};
const style = StyleSheet.create({
  text: {
    fontSize: 20,
    color: appStyle.color_primary,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: appStyle.color_primary,
    padding: 4,
    margin: 10,
    borderRadius: 5,
  },
  leftText: {
    fontSize: 20,
    color: appStyle.color_primary,
  },
  rightText: {
    fontSize: 20,
    color: appStyle.color_on_primary,
  },
  leftSocialButton: {
    borderColor: appStyle.color_primary,
    borderWidth: 1,
    margin: 0,
    padding: 4,
    backgroundColor: appStyle.color_primary,
  },
  rightSocialButton: {
    borderColor: appStyle.color_primary,
    borderWidth: 1,
    margin: 0,
    padding: 4,
    backgroundColor: appStyle.color_on_primary,
  },
});
export default UserScreen;
