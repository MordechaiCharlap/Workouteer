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
import * as appStyle from "../utilities/appStyleSheet";
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
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
import usePushNotifications from "../hooks/usePushNotifications";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import languageService from "../services/languageService";
import NameAndAge from "../components/profileScreen/NameAndAge";
import UserStats from "../components/profileScreen/UserStats";
import AwesomeModal from "../components/AwesomeModal";

const UserScreen = ({ route }) => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();

  const { user } = useAuth();
  const {
    sendPushNotificationUserWantsToBeYourFriend,
    sendPushNotificationUserAcceptedYourFriendRequest,
  } = usePushNotifications();
  const [showReportModal, setShowReportModal] = useState(false);
  const shownUser = route.params.shownUser;
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("User");
    }, [])
  );
  const [friendshipStatus, setFriendshipStatus] = useState(
    route.params.friendshipStatus
  );
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
    await sendPushNotificationUserAcceptedYourFriendRequest(shownUser);
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
    await sendPushNotificationUserWantsToBeYourFriend(shownUser);
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
            {languageService[user.language].removeFriend[user.isMale ? 1 : 0]}
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
            {languageService[user.language].cancelRequest[user.isMale ? 1 : 0]}
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
              {languageService[user.language].accept}
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
              {languageService[user.language].reject}
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
      {!shownUser.isDeleted ? (
        <View className="flex-1">
          <ScrollView
            showsVerticalScrollIndicator={Platform.OS == "web" ? false : true}
          >
            <View className="p-4 gap-y-4">
              <View className="flex-row justify-between items-center">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    size={30}
                    color={appStyle.color_primary}
                  />
                </TouchableOpacity>
                <Text
                  className="text-3xl tracking-widest"
                  style={{ color: appStyle.color_primary }}
                >
                  {shownUser.id}
                </Text>
                <TouchableOpacity onPress={() => setShowReportModal(true)}>
                  <FontAwesomeIcon
                    icon={faShield}
                    size={30}
                    color={appStyle.color_primary}
                  />
                </TouchableOpacity>
              </View>
              <View className="flex-row h-48 items-center">
                <Image
                  source={{
                    uri: shownUser.img,
                  }}
                  className="h-32 w-32 bg-white rounded-full"
                  style={{
                    borderWidth: 1,
                    borderColor: appStyle.color_primary,
                  }}
                />

                <View className="absolute right-0 gap-y-3">
                  <TouchableOpacity
                    className="items-center flex-row rounded-2xl p-3 gap-x-3"
                    style={{ backgroundColor: appStyle.color_primary }}
                    onPress={() =>
                      navigation.navigate("PastWorkouts", {
                        shownUser: shownUser,
                      })
                    }
                  >
                    <Text
                      style={{ fontSize: 30, color: appStyle.color_on_primary }}
                    >
                      {shownUser.workoutsCount}
                    </Text>
                    <FontAwesomeIcon
                      icon={faDumbbell}
                      size={40}
                      color={appStyle.color_on_primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="items-center flex-row rounded-2xl p-3 gap-x-3"
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
                  name={shownUser.displayName}
                  age={calculateAge(shownUser.birthdate.toDate())}
                />
              </View>
              <View>
                <UserStats shownUser={shownUser} />
              </View>

              <View
                className="rounded-xl p-4"
                style={{ backgroundColor: appStyle.color_primary }}
              >
                <Text
                  style={{ color: appStyle.color_on_primary }}
                  className="text-lg"
                >
                  {shownUser.description == ""
                    ? languageService[user.language].noDescriptionYet
                    : user.description}
                </Text>
              </View>
            </View>
          </ScrollView>
          <View
            style={{ backgroundColor: appStyle.color_bg_variant }}
            className="flex-row justify-center px-4 py-2"
          >
            <View className="mr-4">{renderFriendshipButton()}</View>
            {(shownUser.isPublic == true || friendshipStatus == "Friends") && (
              <TouchableOpacity
                className="flex-row items-center justify-center"
                onPress={() => openPrivateChat()}
                style={style.socialButton}
              >
                <Text
                  className="text-center text-xl mr-2"
                  style={{ color: appStyle.color_on_primary }}
                >
                  {languageService[user.language].message[user.isMale ? 1 : 0]}
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
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text
            className="text-4xl font-semibold"
            style={{ color: appStyle.color_primary }}
          >
            {languageService[user.language].userIsDeleted}
          </Text>
        </View>
      )}
      <AwesomeModal
        closeOnTouchOutside={false}
        showModal={showReportModal}
        setShowModal={setShowReportModal}
        title={
          languageService[user.language].doYouWantToReportThisUser[
            user.isMale ? 1 : 0
          ]
        }
        message={
          languageService[user.language].reportUserMessage[user.isMale ? 1 : 0]
        }
        onConfirm={() =>
          navigation.navigate("ReportUser", {
            reported: shownUser,
          })
        }
      />
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
