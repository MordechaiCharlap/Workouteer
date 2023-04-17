import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { React, useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as appStyle from "../components/AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronLeft,
  faUserGroup,
  faDumbbell,
  faPaperPlane,
  faUserMinus,
  faUserPlus,
  faUserXmark,
  faCheck,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
import usePushNotifications from "../hooks/usePushNotifications";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import languageService from "../services/languageService";
import NameAndAge from "../components/profileScreen/NameAndAge";
import UserStats from "../components/profileScreen/UserStats";

const UserScreen = ({ route }) => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();

  const { user } = useAuth();
  const { sendPushNotification } = usePushNotifications();

  const shownUser = route.params.shownUser;
  const [workoutsCount, setWorkoutsCount] = useState();
  const [friendshipStatus, setFriendshipStatus] = useState(
    route.params.friendshipStatus
  );
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("User");
    }, [])
  );
  useEffect(() => {
    const now = new Date();
    var count = 0;
    for (var value of Object.values(user.workouts)) {
      if (value[0].toDate() < now) count++;
    }
    setWorkoutsCount(count);
  }, []);
  const openPrivateChat = async () => {
    const chat = await firebase.getPrivateChatByUsers(user, shownUser);
    navigation.navigate("Chat", { otherUser: shownUser, chat: chat });
  };
  const removeFriend = async () => {
    setFriendshipStatus("None");
    await firebase.removeFriend(user.id, shownUser.id);
  };
  const acceptFriendRequest = async () => {
    setFriendshipStatus("Friends");
    await firebase.acceptFriendRequest(user.id, shownUser.id);
    await sendPushNotification(
      shownUser,
      "You've got a new friend!",
      `You and ${user.displayName} are now friends :),`
    );
  };
  const rejectFriendRequest = async () => {
    setFriendshipStatus("None");
    await firebase.rejectFriendRequest(user.id, shownUser.id);
  };
  const cancelFriendRequest = async () => {
    setFriendshipStatus("None");
    await firebase.cancelFriendRequest(user.id, shownUser.id);
  };
  const sendFriendRequest = async () => {
    setFriendshipStatus("SentRequest");
    await firebase.sendFriendRequest(user.id, shownUser);
    await sendPushNotification(
      shownUser,
      "New Friend Request!",
      `${user.displayName} wants to be your friend :)`
    );
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
          className="flex-row items-center justify-center"
          onPress={sendFriendRequest}
          style={style.socialButton}
        >
          <Text
            className="text-center text-xl mr-2"
            style={{ color: appStyle.color_on_primary }}
          >
            {languageService[user.language].friendRequest}
          </Text>
          <FontAwesomeIcon
            icon={faUserPlus}
            size={20}
            color={appStyle.color_on_primary}
          />
        </TouchableOpacity>
      );
    else if (friendshipStatus == "Friends")
      return (
        <TouchableOpacity
          className="flex-row items-center justify-center"
          onPress={removeFriend}
          style={style.socialButton}
        >
          <Text
            className="text-center text-xl mr-2"
            style={{ color: appStyle.color_on_primary }}
          >
            {languageService[user.language].removeFriend}
          </Text>
          <FontAwesomeIcon
            icon={faUserXmark}
            size={20}
            color={appStyle.color_on_primary}
          />
        </TouchableOpacity>
      );
    else if (friendshipStatus == "SentRequest")
      return (
        <TouchableOpacity
          className="flex-row items-center justify-center"
          onPress={cancelFriendRequest}
          style={style.socialButton}
        >
          <Text
            className="text-center text-xl mr-2"
            style={{ color: appStyle.color_on_primary }}
          >
            {languageService[user.language].cancelRequest}
          </Text>
          <FontAwesomeIcon
            icon={faUserMinus}
            size={20}
            color={appStyle.color_on_primary}
          />
        </TouchableOpacity>
      );
    else if (friendshipStatus == "ReceivedRequest")
      return (
        <View className="flex-row items-center justify-center">
          <TouchableOpacity
            className="rounded-l-lg flex-row items-center justify-center"
            onPress={acceptFriendRequest}
            style={style.leftSocialButton}
          >
            <Text className="text-xl mr-2" style={style.leftText}>
              Accept
            </Text>
            <FontAwesomeIcon
              icon={faCheck}
              size={20}
              color={appStyle.color_on_primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-r-lg flex-row items-center justify-center"
            onPress={rejectFriendRequest}
            style={style.rightSocialButton}
          >
            <Text className="text-xl mr-2" style={style.rightText}>
              Reject
            </Text>
            <FontAwesomeIcon
              icon={faX}
              size={20}
              color={appStyle.color_primary}
            />
          </TouchableOpacity>
        </View>
      );
  };
  return (
    <View style={safeAreaStyle()}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={Platform.OS == "web" ? false : true}
        >
          <View className="p-4 gap-y-4">
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
                {shownUser.id}
              </Text>
              <View className="opacity-0">
                <FontAwesomeIcon icon={faChevronLeft} size={30} />
              </View>
            </View>
            <View className="flex-row h-48 items-center">
              <Image
                source={{
                  uri: shownUser.img,
                }}
                className="h-32 w-32 bg-white rounded-full"
                style={{ borderWidth: 1, borderColor: appStyle.color_primary }}
              />

              <View className="absolute right-0 gap-3">
                <TouchableOpacity
                  className="items-center flex-row rounded-2xl p-3 gap-3"
                  style={{ backgroundColor: appStyle.color_primary }}
                  onPress={() =>
                    navigation.navigate("PastWorkouts", {
                      user: shownUser,
                    })
                  }
                >
                  <Text
                    style={{ fontSize: 30, color: appStyle.color_on_primary }}
                  >
                    {workoutsCount}
                  </Text>
                  <FontAwesomeIcon
                    icon={faDumbbell}
                    size={40}
                    color={appStyle.color_on_primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  className="items-center flex-row rounded-2xl p-3 gap-3"
                  style={{ backgroundColor: appStyle.color_primary }}
                  onPress={() =>
                    navigation.navigate("Friends", {
                      user: shownUser,
                      isMyUser: false,
                    })
                  }
                >
                  <Text
                    style={{ fontSize: 30, color: appStyle.color_on_primary }}
                  >
                    {shownUser.friendsCount}
                  </Text>
                  <FontAwesomeIcon
                    icon={faUserGroup}
                    size={40}
                    color={appStyle.color_on_primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <NameAndAge
                name={user.displayName}
                age={calculateAge(user.birthdate.toDate())}
              />
            </View>
            <View>
              <UserStats shownUser={shownUser} />
            </View>

            <Text style={{ color: appStyle.color_primary }} className="text-lg">
              {shownUser.description == ""
                ? "No description yet"
                : shownUser.description}
            </Text>
            <View className="flex-row absolute bottom-0 right-0 left-0 justify-center p-4 gap-4">
              {renderFriendshipButton()}
              {(shownUser.isPublic == true ||
                friendshipStatus == "Friends") && (
                <TouchableOpacity
                  className="flex-row items-center justify-center"
                  onPress={() => openPrivateChat()}
                  style={style.socialButton}
                >
                  <Text
                    className="text-center text-xl mr-2"
                    style={{ color: appStyle.color_on_primary }}
                  >
                    {languageService[user.language].message}
                  </Text>
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    size={20}
                    color={appStyle.color_on_primary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
const style = StyleSheet.create({
  text: {
    fontSize: 20,
    color: appStyle.color_primary,
  },
  socialButton: {
    flexGrow: 1,
    backgroundColor: appStyle.color_primary,
    padding: 8,
    borderRadius: 5,
  },
  leftText: {
    fontSize: 20,
    color: appStyle.color_on_primary,
  },
  rightText: {
    fontSize: 20,
    color: appStyle.color_primary,
  },
  leftSocialButton: {
    flexGrow: 1,
    backgroundColor: appStyle.color_primary,
    padding: 8,
    borderLeftRadius: 5,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  rightSocialButton: {
    flexGrow: 1,
    backgroundColor: appStyle.color_primary,
    padding: 8,
    borderRightRadius: 5,
    backgroundColor: appStyle.color_bg,
    borderColor: appStyle.color_primary,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
});
export default UserScreen;
