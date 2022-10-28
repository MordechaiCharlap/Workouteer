import {
  Image,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { React, useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import ResponsiveStyling from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import * as firebase from "../services/firebase";
import authContext from "../context/authContext";
const UserScreen = ({ route }) => {
  const { user } = useContext(authContext);
  const shownUser = route.params.shownUser;
  const navigation = useNavigation();

  const [friendshipStatus, setFriendshipStatus] = useState(
    route.params.friendshipStatus
  );

  useLayoutEffect(() => {
    console.log(shownUser);
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const removeFriend = async () => {
    await firebase.removeFriend(user.usernameLower, shownUser.usernameLower);
  };
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
            Delete friend
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
    else if (friendshipStatus == "ReceivedRequest")
      return (
        <View className="flex-row items-center" style={style.socialButton}>
          <TouchableOpacity
            onPress={rejectFriendRequest}
            style={style.leftSocialButton}
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
            style={style.rightSocialButton}
          >
            <Text
              className="text-center text-xl"
              style={{ color: appStyle.appGray }}
            >
              Accept
            </Text>
          </TouchableOpacity>
        </View>
      );
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1">
        <ScrollView>
          <View className="p-4">
            <View className="flex-row justify-between">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  size={30}
                  color={appStyle.appGray}
                />
              </TouchableOpacity>
              <Text
                className=" text-center text-3xl tracking-widest"
                style={{ color: appStyle.appGray }}
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
                  <TouchableOpacity className="items-center">
                    <Text
                      style={{ fontSize: 20, color: appStyle.appGray }}
                      className="font-bold"
                    >
                      {shownUser.workoutsCount}
                    </Text>
                    <Text style={{ fontSize: 20, color: appStyle.appGray }}>
                      Workouts
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    className="items-center"
                    onPress={showOtherUserFriends}
                  >
                    <Text style={{ fontSize: 20, color: appStyle.appGray }}>
                      {shownUser.friendsCount}
                    </Text>
                    <Text style={{ fontSize: 20, color: appStyle.appGray }}>
                      Friends
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View className="flex-row items-center self-center">
              {renderFriendshipButton()}
              {(shownUser.isPublic == true ||
                friendshipStatus == "Friends") && (
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
        </ScrollView>
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
  leftSocialButton: {
    marginRight: 0,
    paddingRight: 5,
    borderWidth: 1,
    borderTopColor: appStyle.appDarkBlue,
    borderLeftColor: appStyle.appDarkBlue,
    borderBottomColor: appStyle.appDarkBlue,
    borderRightColor: appStyle.appGray,
  },
  rightSocialButton: {
    marginLeft: 0,
    paddingLeft: 5,
    borderWidth: 1,
    borderTopColor: appStyle.appDarkBlue,
    borderRightColor: appStyle.appDarkBlue,
    borderBottomColor: appStyle.appDarkBlue,
    borderLeftColor: appStyle.appGray,
  },
});
export default UserScreen;
