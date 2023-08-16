import { createContext, useState, useRef, useContext, useEffect } from "react";
import * as Device from "expo-device";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as firebase from "../services/firebase";
import useAuth from "./useAuth";
import languageService from "../services/languageService";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import useFirebase from "./useFirebase";
import { useNavigation } from "@react-navigation/native";
import CustomModal from "../components/basic/CustomModal";
import CustomText from "../components/basic/CustomText";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { color_primary } from "../utils/appStyleSheet";
const NotificationsContext = createContext();
export const NotificationsProvider = ({ children }) => {
  const navigation = useNavigation();
  const { db } = useFirebase();
  const [notificationPermission, setNotificationPermission] = useState();
  const [clickedNotification, setClickedNotification] = useState();
  const clearNotifications = async () => {
    const presentedNotifications =
      await Notifications.getPresentedNotificationsAsync();
    presentedNotifications.forEach(async (notification) => {
      await Notifications.dismissNotificationAsync(
        notification.request.identifier
      );
    });
  };

  const notificationListenerRef = useRef();
  const responseListenerRef = useRef();
  const { user, userLoaded } = useAuth();
  const clearListeners = () => {
    if (notificationListenerRef.current != null) {
      Notifications.removeNotificationSubscription(
        notificationListenerRef.current
      );
      if (responseListenerRef.current != null) {
        Notifications.removeNotificationSubscription(
          responseListenerRef.current
        );
      }
    }
  };
  useEffect(() => {
    if (userLoaded && clickedNotification) {
      const notificationType =
        clickedNotification.notification.request.content.data["type"];
      if (notificationType == "workoutDetails") {
        getDoc(
          doc(
            db,
            "workouts",
            clickedNotification.notification.request.content.data["workoutId"]
          )
        ).then((doc) => {
          setClickedNotification();
          navigation.navigate("WorkoutDetails", {
            workout: { ...doc.data(), id: doc.id },
            cameFromPushNotification: true,
          });
        });
      } else if (notificationType == "chat") {
        getDoc(
          doc(
            db,
            "users",
            clickedNotification.notification.request.content.data["otherUserId"]
          )
        ).then((userDoc) => {
          getDoc(
            doc(
              db,
              "chats",
              clickedNotification.notification.request.content.data["chatId"]
            )
          ).then((chatDoc) => {
            setClickedNotification();
            navigation.navigate("Chat", {
              otherUser: userDoc.data(),
              chat: chatDoc.data(),
              cameFromPushNotification: true,
            });
          });
        });
      }
    }
  }, [userLoaded, clickedNotification]);
  useEffect(() => {
    const clearAsyncNotifications = async () => {
      await clearNotifications();
    };
    if (
      Platform.OS != "web"
      // && Device.isDevice
    )
      clearAsyncNotifications();
  }, []);
  useEffect(() => {
    if (!userLoaded || Platform.OS == "web") {
      clearListeners();
    } else {
      checkForNotificationPermission().then((status) => {
        setNotificationPermission(status);
      });
    }
    // else if ( rememberMe ) notificationListen();
    return () => {
      clearListeners();
    };
  }, [userLoaded]);
  useEffect(() => {
    if (notificationPermission) {
      notificationListen();
      configureNotification();
      Notifications.getExpoPushTokenAsync().then((result) => {
        if (result.data != user.pushToken) tokenUpdateLogic(result.data);
      });
    }
  }, [notificationPermission]);
  const checkForNotificationPermission = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    return existingStatus == "granted";
  };
  const notificationListen = () => {
    if (notificationListenerRef.current && responseListenerRef.current) return;
    if (
      Platform.OS != "web"
      // && Device.isDevice
    ) {
      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListenerRef.current =
        Notifications.addNotificationReceivedListener((notification) => {});

      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListenerRef.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          setClickedNotification(response);
        });
    }
  };

  const configureNotification = () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };
  const tokenUpdateLogic = (token) => {
    firebase.deletePushTokenForUserWhoIsNotMe(user.id, token);
    updateDoc(doc(db, `users/${user.id}`), { pushToken: token });
  };
  const sendPushNotificationUserLeftWorkout = async (
    workout,
    leavingUserId,
    leavingUserDisplayName
  ) => {
    const membersArray = await firebase.getWorkoutMembers(workout);
    for (var user of membersArray) {
      if (user.id == leavingUserId) continue;
      await sendPushNotification(
        user,
        "Workouteer",
        `${leavingUserDisplayName} ${
          languageService[user.language].leftTheWorkout[user.isMale ? 1 : 0]
        }`,
        { type: "workoutDetails", workoutId: workout.id }
      );
    }
  };
  const sendPushNotificationUserAcceptedYourFriendRequest = async (
    acceptedUser
  ) => {
    await sendPushNotification(
      acceptedUser,
      "Workouteer",
      `${user.displayName} ${
        languageService[acceptedUser.language].acceptedYourFriendRequest[
          user.isMale ? 1 : 0
        ]
      }`
    );
  };
  const sendPushNotificationUserWantsToBeYourFriend = async (askedUser) => {
    await sendPushNotification(
      askedUser,
      "Workouteer",
      `${user.displayName} ${
        languageService[askedUser.language].wantsToBeYourFriend[
          user.isMale ? 1 : 0
        ]
      }`
    );
  };
  const sendPushNotificationCreatorLeftWorkout = async (
    workout,
    leavingUserId,
    leavingUserDisplayName
  ) => {
    const membersArray = await firebase.getWorkoutMembers(workout);
    for (var user of membersArray) {
      if (user.id == leavingUserId) continue;
      await sendPushNotification(
        user,
        "Workouteer",
        `${leavingUserDisplayName} ${
          languageService[user.language].leftTheWorkout[user.isMale ? 1 : 0]
        }, ${
          user.id == workout.creator
            ? languageService[user.language].youAreTheNewAdmin[
                user.isMale ? 1 : 0
              ]
            : `${languageService[user.language].theNewAdmin}: ${
                workout.creator
              }`
        }`,
        { type: "workoutDetails", workoutId: workout.id }
      );
    }
  };
  const sendPushNotificationUserJoinedYouwWorkout = async (
    workout,
    joinedUser,
    excludeUserId
  ) => {
    const membersArray = await firebase.getWorkoutMembers(workout);
    for (var user of membersArray) {
      if (user.id != excludeUserId)
        await sendPushNotification(
          user,
          "Workouteer",
          `${joinedUser.displayName} ${
            languageService[user.language].joinedYourWorkout[
              joinedUser.isMale ? 1 : 0
            ]
          }`,
          { type: "workoutDetails", workoutId: workout.id }
        );
    }
  };
  const sendPushNotificationUserWantsToJoinYourWorkout = async (
    requester,
    creatorData,
    workout
  ) => {
    await sendPushNotification(
      creatorData,
      "Workouteer",
      `${requester.displayName} ${
        languageService[creatorData.language].wantsToJoinYourWorkout[
          requester.isMale ? 1 : 0
        ]
      }`,
      { type: "workoutDetails", workoutId: workout.id }
    );
  };
  const sendPushNotificationChatMessage = async (
    otherUser,
    sender,
    content,
    chatId
  ) => {
    await sendPushNotification(
      otherUser,
      "Workouteer",
      `${sender.displayName}: ${content}`,
      { type: "chat", chatId: chatId, otherUserId: sender.id }
    );
  };
  const schedulePushNotification = async (trigger, title, body, data) => {
    const pushNotification = {
      sound: "default",
      // title: title,
      body: body,
      data: data ? data : {},
    };
    const scheduledNotificationId =
      await Notifications.scheduleNotificationAsync({
        content: { ...pushNotification },
        trigger,
      });
    return scheduledNotificationId;
  };
  const cancelScheduledPushNotification = async (identifier) => {
    if (
      identifier != null &&
      Platform.OS != "web"
      // && Device.isDevice
    )
      await Notifications.cancelScheduledNotificationAsync(identifier);
  };
  const sendPushNotification = async (userToSend, title, body, data) => {
    if (Platform.OS == "web") return;
    if (userToSend.pushToken) {
      const pushNotification = {
        to: userToSend.pushToken,
        sound: "default",
        // title: "",
        body: body,
        data: data ?? {},
      };
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pushNotification),
      });
    }
  };
  const sendPushNotificationCreatorAcceptedYourRequest = async (
    otherUser,
    workoutId
  ) => {
    await sendPushNotification(
      otherUser,
      "Workouteer",
      `${user.displayName} ${
        languageService[otherUser.language].acceptedYourWorkoutRequest[
          user.isMale ? 1 : 0
        ]
      }`,
      { type: "workoutDetails", workoutId: workoutId }
    );
  };
  const sendFriendsWorkoutNotificationMessage = async (
    workoutType,
    friend,
    workoutId
  ) => {
    const body =
      user.displayName +
      " " +
      languageService[friend.language].scheduled[user.isMale ? 1 : 0] +
      " " +
      languageService[friend.language].scheduledWorkout[workoutType] +
      ", " +
      languageService[friend.language].askToJoin[friend.isMale ? 1 : 0];
    await sendPushNotification(friend, "", body, {
      type: "workoutDetails",
      workoutId: workoutId,
    });
  };
  const sendPushNotificationInviteFriendToWorkout = async (friend, workout) => {
    await sendPushNotification(
      friend,
      "Workouteer",
      `${user.displayName} ${
        languageService[friend.language].invitedYouToWorkout[
          user.isMale ? 1 : 0
        ]
      }`,
      {
        type: "workoutDetails",
        workoutId: workout.id,
      }
    );
  };
  const sendPushNotificationForFriendsAboutWorkout = async (
    workoutSex,
    workoutType,
    workoutId
  ) => {
    for (var friendId of Object.keys(user.friends)) {
      const friend = await firebase.getUserDataById(friendId);
      if (workoutSex == "everyone" || user.isMale == friend.isMale) {
        sendFriendsWorkoutNotificationMessage(workoutType, friend, workoutId);
      }
    }
  };
  return (
    <NotificationsContext.Provider
      value={{
        sendPushNotification,
        sendPushNotificationUserWantsToBeYourFriend,
        sendPushNotificationUserAcceptedYourFriendRequest,
        sendPushNotificationUserWantsToJoinYourWorkout,
        sendPushNotificationCreatorAcceptedYourRequest,
        sendPushNotificationUserLeftWorkout,
        sendPushNotificationForFriendsAboutWorkout,
        sendPushNotificationCreatorLeftWorkout,
        sendPushNotificationUserJoinedYouwWorkout,
        sendPushNotificationChatMessage,
        sendPushNotificationInviteFriendToWorkout,
        schedulePushNotification,
        cancelScheduledPushNotification,
      }}
    >
      {children}
      {user && notificationPermission == false && Platform.OS != "web" && (
        <PushNotificationsPermissionModal
          user={user}
          setNotificationPermission={setNotificationPermission}
        />
      )}
    </NotificationsContext.Provider>
  );
};
export default function usePushNotifications() {
  return useContext(NotificationsContext);
}
const PushNotificationsPermissionModal = ({
  user,
  setNotificationPermission,
}) => {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setShowModal(true);
  }, []);
  const askForPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
    if (finalStatus !== "granted") {
      setNotificationPermission(null);
      return;
    }
    setNotificationPermission(true);
  };
  return (
    <CustomModal
      showModal={showModal}
      setShowModal={setShowModal}
      confirmButton
      cancelButton
      language={user.language}
      onConfirm={askForPermission}
      style={{ rowGap: 20, alignItems: "center" }}
    >
      <FontAwesomeIcon icon={faToggleOn} size={80} color={color_primary} />
      <CustomText
        style={{ fontSize: 20, fontWeight: 600, textAlign: "center" }}
      >
        {
          languageService[user.language].pushNotificationModalTitle[
            user.isMale ? 1 : 0
          ]
        }
      </CustomText>
      <CustomText style={{ textAlign: "center" }}>
        {languageService[user.language].pushNotificationModalMessage}
      </CustomText>
    </CustomModal>
  );
};
