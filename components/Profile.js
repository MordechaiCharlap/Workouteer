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
import { safeAreaStyle } from "./safeAreaStyle";
import * as appStyle from "../utilities/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronLeft,
  faPaperPlane,
  faUserMinus,
  faUserPlus,
  faUserXmark,
  faCheck,
  faX,
  faShield,
  faUserPen,
  faGear,
  faDumbbell,
  faUserGroup,
  faCircleCheck,
  faExclamationCircle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
import usePushNotifications from "../hooks/usePushNotifications";
import languageService from "../services/languageService";
import NameAndAge from "./profileScreen/NameAndAge";
import UserStats from "./profileScreen/UserStats";
import AwesomeModal from "./AwesomeModal";
import UserDetailsButton from "./profileScreen/UserDetailsButton";
import CustomButton from "./basic/CustomButton";
import CustomText from "./basic/CustomText";

const Profile = ({ shownUser, isMyUser, initialFriendshipStatus }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const {
    sendPushNotificationUserWantsToBeYourFriend,
    sendPushNotificationUserAcceptedYourFriendRequest,
  } = usePushNotifications();
  const [showReportModal, setShowReportModal] = useState(false);
  const [futureWorkoutsCount, setFutureWorkoutsCount] = useState(
    isMyUser ? Object.keys(shownUser.plannedWorkouts).length : 0
  );

  const [friendshipStatus, setFriendshipStatus] = useState(
    initialFriendshipStatus
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
  const buttonStyle = {
    color: appStyle.color_on_surface_variant,
    backgroundColor: appStyle.color_surface_variant,
    paddingHorizontal: 15,
    borderRadius: 999,
    flexDirection: "row",
  };
  const plannedButtonStyle = {
    color: appStyle.color_background,
    backgroundColor: appStyle.color_on_background,
    paddingHorizontal: 15,
    borderRadius: 999,
    flexDirection: "row",
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
  const countFutureWorkouts = () => {
    const now = new Date(); // Get the current time
    const count = Object.values(shownUser.plannedWorkouts).reduce(
      (acc, element) => {
        const startingDate = new Date(element[0].toDate());

        if (startingDate > now) {
          return acc + 1;
        }
        return acc;
      },
      0
    );

    setFutureWorkoutsCount(count);
  };
  useEffect(() => {
    if (!isMyUser) countFutureWorkouts();
  }, []);
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
              icon={faExcelamtion}
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
  return user.userIsDeleted ? (
    <View
      style={safeAreaStyle()}
      className="flex-1 justify-center items-center px-2"
    >
      <Text
        className="text-4xl font-semibold text-center"
        style={{ color: appStyle.color_on_background }}
      >
        {languageService[user.language].userIsDeleted}
      </Text>
    </View>
  ) : (
    <View className="flex-1 mt-3">
      <ScrollView
        showsVerticalScrollIndicator={Platform.OS == "web" ? false : true}
      >
        <View
          style={{
            rowGap: 16,
          }}
        >
          <View
            style={{
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{
                borderRadius: 20,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Image
                  source={{
                    uri: shownUser.img,
                  }}
                  className=" bg-white rounded-full"
                  style={{
                    height: 120,
                    aspectRatio: 1 / 1,
                    borderWidth: 1,
                    borderColor: appStyle.color_outline,
                  }}
                />
              </View>
              <View
                style={{
                  alignItems: "flex-end",
                }}
              >
                <View className="flex-row items-center">
                  {futureWorkoutsCount > 0 && (
                    <UserDetailsButton
                      buttonStyle={plannedButtonStyle}
                      color={plannedButtonStyle.color}
                      iconColor={plannedButtonStyle.color}
                      onPress={() => navigation.navigate("FutureWorkouts")}
                      text={futureWorkoutsCount}
                      icon={faClock}
                      smallIcon={faExclamationCircle}
                      specialButton={true}
                    />
                  )}

                  <View style={{ width: 20 }}></View>
                  <UserDetailsButton
                    buttonStyle={buttonStyle}
                    color={buttonStyle.color}
                    iconColor={buttonStyle.color}
                    onPress={() => navigation.navigate("PastWorkouts")}
                    text={shownUser.workoutsCount}
                    icon={faDumbbell}
                    smallIcon={faCircleCheck}
                  />
                </View>
                <View style={{ height: 20 }}></View>
                <CustomButton
                  style={buttonStyle}
                  onPress={() =>
                    navigation.navigate("Friends", {
                      user: shownUser,
                      isMyUser: isMyUser,
                    })
                  }
                >
                  <CustomText
                    style={{ fontSize: 25, color: buttonStyle.color }}
                  >
                    {shownUser.friendsCount}
                  </CustomText>
                  <View style={{ width: 10 }}></View>
                  <FontAwesomeIcon
                    icon={faUserGroup}
                    size={30}
                    color={buttonStyle.color}
                  />
                  {isMyUser && shownUser.friendRequestsCount > 0 ? (
                    <View className="absolute right-0 bottom-0">
                      <AlertDot
                        text={user.friendRequestsCount}
                        color={buttonStyle.backgroundColor}
                        borderColor={appStyle.color_surface}
                        textColor={buttonStyle.color}
                        borderWidth={1}
                        fontSize={13}
                        size={23}
                      />
                    </View>
                  ) : (
                    <></>
                  )}
                </CustomButton>
              </View>
            </View>
          </View>
          <View
            style={{
              backgroundColor: appStyle.color_surface,
              rowGap: 16,
              paddingHorizontal: 16,
              borderTopColor: appStyle.color_outline,
              borderTopWidth: 0.8,
            }}
          >
            <View>
              <CustomText
                style={{
                  fontSize: 16,
                  color: appStyle.color_on_surface,
                }}
              >
                #{shownUser.id}
              </CustomText>
              <NameAndAge
                name={shownUser.displayName}
                age={calculateAge()}
                color={appStyle.color_on_surface}
              />
            </View>
            <View>
              <UserStats
                shownUser={shownUser}
                color={appStyle.color_on_background}
                backgroundColor={appStyle.color_surface_variant}
              />
            </View>
            <View
              className="rounded-xl p-4"
              style={{ backgroundColor: appStyle.color_surface_variant }}
            >
              <CustomText
                style={{ color: appStyle.color_on_background }}
                className="text-lg"
              >
                {shownUser.description == ""
                  ? languageService[user.language].noDescriptionYet
                  : shownUser.description}
              </CustomText>
            </View>
          </View>
        </View>
      </ScrollView>
      {!isMyUser && (
        <View
          style={{ backgroundColor: appStyle.color_background_variant }}
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
    backgroundColor: appStyle.color_background,
    borderColor: appStyle.color_primary,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
});
export default Profile;
