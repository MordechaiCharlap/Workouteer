import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { React, useCallback, useEffect, useState } from "react";
import * as appStyle from "../../utils/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronLeft,
  faPaperPlane,
  faUserMinus,
  faUserPlus,
  faUserXmark,
  faX,
  faShield,
  faUserPen,
  faGear,
  faDumbbell,
  faUserGroup,
  faCircleCheck,
  faExclamationCircle,
  faClock,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import * as firebase from "../../services/firebase";
import useAuth from "../../hooks/useAuth";
import usePushNotifications from "../../hooks/usePushNotifications";
import languageService from "../../services/languageService";
import NameAndAge from "./NameAndAge";
import UserStats from "./UserStats";
import AwesomeModal from "../AwesomeModal";
import UserDetailsButton from "./UserDetailsButton";
import CustomButton from "../basic/CustomButton";
import CustomText from "../basic/CustomText";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import appComponentsDefaultStyles from "../../utils/appComponentsDefaultStyles";
import UserDescription from "./UserDescription";
import { checkFriendShipStatus } from "../../utils/profileUtils";
import useFriendRequests from "../../hooks/useFriendRequests";
import NumberedNotification from "../NumberedNotification";
import useAlerts from "../../hooks/useAlerts";
import CustomModal from "../basic/CustomModal";

const Profile = ({ shownUser, isMyUser }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { sentFriendRequests, receivedFriendRequests } = useFriendRequests();
  const {
    sendPushNotificationUserWantsToBeYourFriend,
    sendPushNotificationUserAcceptedYourFriendRequest,
  } = usePushNotifications();
  const [showReportModal, setShowReportModal] = useState(false);
  const [futureWorkoutsCount, setFutureWorkoutsCount] = useState(
    isMyUser ? Object.keys(shownUser.plannedWorkouts).length : 0
  );
  const [friendshipStatus, setFriendshipStatus] = useState();
  const { friendRequestsAlerts } = useAlerts();
  const openPrivateChat = async () => {
    const chat = await firebase.getPrivateChatByUsers(user, shownUser);
    navigation.navigate("Chat", { otherUser: shownUser, chat: chat });
  };
  const removeFriend = async () => {
    setFriendshipStatus("None");
    firebase.removeFriend(user.id, shownUser.id);
  };
  const acceptFriendRequest = async () => {
    setFriendshipStatus("Friends");
    firebase.acceptFriendRequest(user.id, shownUser.id);
    sendPushNotificationUserAcceptedYourFriendRequest(shownUser);
  };
  const rejectFriendRequest = async () => {
    setFriendshipStatus("None");
    firebase.rejectFriendRequest(user.id, shownUser.id);
  };
  const cancelFriendRequest = async () => {
    setFriendshipStatus("None");
    firebase.cancelFriendRequest(user.id, shownUser.id);
  };
  const sendFriendRequest = async () => {
    setFriendshipStatus("SentRequest");
    firebase.sendFriendRequest(user.id, shownUser);
    sendPushNotificationUserWantsToBeYourFriend(shownUser);
  };
  const buttonStyle = {
    color: appStyle.color_on_surface_variant,
    backgroundColor: appStyle.color_surface_variant,
    flexDirection: "row",
  };
  const plannedButtonStyle = {
    color: appStyle.color_background,
    backgroundColor: appStyle.color_on_background,
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
  }, [shownUser]);
  useEffect(() => {
    if (isMyUser || !sentFriendRequests || !receivedFriendRequests) return;
    const currentFriendshipStatus = checkFriendShipStatus(
      user,
      shownUser.id,
      sentFriendRequests,
      receivedFriendRequests
    );
    if (currentFriendshipStatus != friendshipStatus)
      setFriendshipStatus(currentFriendshipStatus);
  }, [receivedFriendRequests]);
  const renderFriendshipButton = () => {
    if (friendshipStatus != "ReceivedRequest") {
      var onPressFunc;
      var buttonText;
      var icon;
      switch (friendshipStatus) {
        case "None":
          onPressFunc = sendFriendRequest;
          buttonText = languageService[user.language].friendRequest;
          icon = faUserPlus;
          break;
        case "Friends":
          onPressFunc = removeFriend;
          buttonText =
            languageService[user.language].removeFriend[user.isMale ? 1 : 0];
          icon = faUserXmark;
          break;
        case "SentRequest":
          onPressFunc = cancelFriendRequest;
          buttonText =
            languageService[user.language].cancelRequest[user.isMale ? 1 : 0];
          icon = faUserMinus;
          break;
        default:
          break;
      }
      return (
        <CustomButton
          className="flex-row"
          round
          onPress={onPressFunc}
          style={style.socialButton}
        >
          <CustomText
            className="text-center text-xl mr-2"
            style={{ color: appStyle.color_on_surface_variant }}
          >
            {buttonText}
          </CustomText>
          <FontAwesomeIcon
            icon={icon}
            size={20}
            color={appStyle.color_primary}
          />
        </CustomButton>
      );
    }
    return (
      <View className="flex-row items-center justify-center">
        <CustomButton
          className="flex-row items-center rounded-l-full"
          round
          onPress={acceptFriendRequest}
          style={[
            style.socialButton,
            {
              borderWidth: 0.5,
              borderColor: appStyle.color_outline,
            },
          ]}
        >
          <CustomText
            className="text-center text-xl mr-2"
            style={{ color: appStyle.color_success }}
          >
            {languageService[user.language].accept}
          </CustomText>
          <FontAwesomeIcon
            icon={faCheck}
            size={20}
            color={appStyle.color_success}
          />
        </CustomButton>
        <CustomButton
          className="flex-row items-center rounded-r-full"
          onPress={rejectFriendRequest}
          style={[
            style.socialButton,
            {
              borderWidth: 0.5,
              borderColor: appStyle.color_outline,
            },
          ]}
        >
          <CustomText
            className="text-center text-xl mr-2"
            style={{ color: appStyle.color_error }}
          >
            {languageService[user.language].reject}
          </CustomText>
          <FontAwesomeIcon icon={faX} size={20} color={appStyle.color_error} />
        </CustomButton>
      </View>
    );
  };
  return shownUser.isDeleted ? (
    <View className="flex-1 justify-center items-center px-2">
      <Text
        className="text-4xl font-semibold text-center"
        style={{ color: appStyle.color_on_background }}
      >
        {languageService[user.language].userIsDeleted}
      </Text>
    </View>
  ) : (
    <View className="flex-1">
      <View
        className="py-3"
        style={{
          backgroundColor: appStyle.color_surface_variant,
          paddingHorizontal: 16,
          borderBottomColor: appStyle.color_outline,
          borderBottomWidth: 0.5,
        }}
      >
        {isMyUser ? (
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => navigation.navigate("EditData")}>
              <FontAwesomeIcon
                icon={faUserPen}
                size={30}
                color={appStyle.color_on_background}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Settings", { language: user.language })
              }
            >
              <FontAwesomeIcon
                icon={faGear}
                size={30}
                color={appStyle.color_on_background}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={30}
                color={appStyle.color_on_background}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowReportModal(true)}>
              <FontAwesomeIcon
                icon={faShield}
                size={30}
                color={appStyle.color_on_background}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View style={{ height: 10 }} />
        <View
          style={{
            paddingHorizontal: 16,
            borderRadius: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
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
                  onPress={() =>
                    navigation.navigate("FutureWorkouts", {
                      shownUser: !isMyUser ? shownUser : null,
                    })
                  }
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
                onPress={() =>
                  navigation.navigate("PastWorkouts", {
                    shownUser: !isMyUser ? shownUser : null,
                  })
                }
                text={shownUser.workoutsCount}
                icon={faDumbbell}
                smallIcon={faCircleCheck}
              />
            </View>
            <View style={{ height: 20 }}></View>
            <CustomButton
              round
              style={[buttonStyle, appComponentsDefaultStyles.shadow]}
              onPress={() => {
                navigation.navigate("Friends", {
                  shownUser: shownUser,
                  isMyUser: isMyUser,
                });
              }}
            >
              <CustomText style={{ fontSize: 25, color: buttonStyle.color }}>
                {shownUser.friendsCount}
              </CustomText>
              <View style={{ width: 10 }}></View>
              <FontAwesomeIcon
                icon={faUserGroup}
                size={30}
                color={buttonStyle.color}
              />
              {isMyUser &&
                receivedFriendRequests &&
                Object.keys(receivedFriendRequests).length > 0 && (
                  <View className="absolute right-0 bottom-0">
                    {/* <AlertDot
                      text={Object.keys(receivedFriendRequests).length}
                      color={appStyle.color_primary}
                      borderColor={appStyle.color_surface}
                      textColor={appStyle.color_on_primary}
                      borderWidth={1}
                      fontSize={13}
                      size={23}
                    /> */}
                    <NumberedNotification
                      number={Object.keys(receivedFriendRequests).length}
                      surfaceColor={appStyle.color_surface_variant}
                      alert={Object.keys(friendRequestsAlerts).length > 0}
                    />
                  </View>
                )}
            </CustomButton>
          </View>
        </View>
        <View
          style={{
            rowGap: 16,
            marginTop: 16,
            paddingHorizontal: 16,
          }}
        >
          <View>
            <CustomText
              style={{
                fontSize: 12,
                color: appStyle.color_on_surface,
              }}
            >
              #{shownUser.id}
            </CustomText>
            <NameAndAge
              name={shownUser.displayName}
              age={calculateAge()}
              color={appStyle.color_on_background}
            />
          </View>
          <UserStats
            shownUser={shownUser}
            color={appStyle.color_on_background}
            backgroundColor={appStyle.color_surface_variant}
          />
          <UserDescription
            description={shownUser.description}
            language={user.language}
          />
        </View>
        <View style={{ height: 10 }} />
      </ScrollView>
      {!isMyUser && (
        <View
          style={{
            backgroundColor: appStyle.color_background_variant,
            paddingHorizontal: 16,
          }}
          className="flex-row justify-center py-2"
        >
          {friendshipStatus && (
            <View className="mr-4">{renderFriendshipButton()}</View>
          )}
          {(shownUser.isPublic == true || friendshipStatus == "Friends") && (
            <CustomButton
              className="flex-row"
              round
              onPress={() => openPrivateChat()}
              style={style.socialButton}
            >
              <Text
                className="text-center text-xl mr-2"
                style={{ color: appStyle.color_on_surface_variant }}
              >
                {languageService[user.language].message[user.isMale ? 1 : 0]}
              </Text>
              <FontAwesomeIcon
                icon={faPaperPlane}
                size={20}
                color={appStyle.color_primary}
              />
            </CustomButton>
          )}
        </View>
      )}
      {!isMyUser && (
        <CustomModal
          showModal={showReportModal}
          setShowModal={setShowReportModal}
          closeOnTouchOutside
          confirmButton
          cancelButton
          language={user.language}
          onConfirm={() => {
            setShowReportModal(false);
            navigation.navigate("ReportUser", {
              reported: shownUser,
            });
          }}
        >
          <CustomText className="text-xl font-semibold text-center">
            {
              languageService[user.language].doYouWantToReportThisUser[
                user.isMale ? 1 : 0
              ]
            }
          </CustomText>
          <CustomText>
            {
              languageService[user.language].reportUserMessage[
                user.isMale ? 1 : 0
              ]
            }
          </CustomText>
        </CustomModal>
      )}
    </View>
  );
};
const style = StyleSheet.create({
  socialButton: {
    flexGrow: 1,
    backgroundColor: appStyle.color_surface_variant,
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
