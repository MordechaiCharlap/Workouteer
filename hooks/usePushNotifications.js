import { createContext, useState, useRef, useContext } from "react";
import * as Device from "expo-device";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as firebase from "../services/firebase";
import useAuth from "./useAuth";
import languageService from "../services/languageService";
const NotificationsContext = createContext();
export const NotificationsProvider = ({ children }) => {
  const [pushToken, setPushToken] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();
  const { user } = useAuth();
  const notificationListenerFunction = async () => {
    if (Platform.OS != "web") {
      registerForPushNotifications().then((token) => setPushToken(token));
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {});

      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {});

      return () => {
        if (responseListener) {
          Notifications.removeNotificationSubscription(
            notificationListener.current
          );
        }
      };
    }
  };
  const registerForPushNotifications = async () => {
    let token;
    if (Device.isDevice) {
      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        try {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        } catch (error) {}
      }
      if (finalStatus !== "granted") {
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      if (token && token != user.token) {
        const updatedUser = { ...user, pushToken: token };
        await firebase.updateUser(updatedUser);
      }
    } else {
      // Must use physical device for Push Notifications
    }
    return token;
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
        }`
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
        }`
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
      if (user.id == excludeUserId) continue;
      await sendPushNotification(
        user,
        "Workouteer",
        `${joinedUser.displayName} ${
          languageService[user.language].joinedYourWorkout[
            joinedUser.isMale ? 1 : 0
          ]
        }`
      );
    }
  };
  const sendPushNotificationUserWantsToJoinYourWorkout = async (
    requester,
    creatorData
  ) => {
    await sendPushNotification(
      creatorData,
      "Workouteer",
      `${requester.displayName} ${
        languageService[creatorData.language].wantsToJoinYourWorkout[
          requester.isMale ? 1 : 0
        ]
      }`
    );
  };
  const sendPushNotificationChatMessage = async (
    otherUser,
    sender,
    content
  ) => {
    await sendPushNotification(
      otherUser,
      "Workouteer",
      `${sender.displayName}: ${content}`
    );
  };
  const sendPushNotificationsForWorkoutMembers = async (
    workout,
    title,
    body,
    data,
    excludeUserId
  ) => {
    const membersArray = await firebase.getWorkoutMembers(workout);
    for (var user of membersArray) {
      if (user.id == excludeUserId) continue;

      if (user.pushToken) {
        const pushNotification = {
          to: user.pushToken,
          sound: "default",
          title: title,
          body: body,
          data: data ? data : {},
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
    }
  };
  const schedulePushNotification = async (trigger, title, body, data) => {
    const pushNotification = {
      sound: "default",
      title: title,
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
    if (identifier != null && Platform.OS != "web")
      await Notifications.cancelScheduledNotificationAsync(identifier);
  };
  const sendPushNotification = async (userToSend, title, body, data) => {
    if (userToSend.pushToken) {
      const pushNotification = {
        to: userToSend.pushToken,
        sound: "default",
        title: "",
        body: body,
        data: data ? data : {},
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
  const sendPushNotificationCreatorAcceptedYourRequest = async (otherUser) => {
    await sendPushNotification(
      otherUser,
      "Workouteer",
      `${user.displayName} ${
        languageService[otherUser.language].acceptedYourWorkoutRequest[
          user.isMale ? 1 : 0
        ]
      }`
    );
  };
  const sendFriendsWorkoutNotificationMessage = async (workoutType, friend) => {
    const title =
      user.displayName +
      " " +
      languageService[friend.language].scheduled[user.isMale ? 1 : 0] +
      " " +
      languageService[friend.language].scheduledWorkout[workoutType];
    const body =
      languageService[friend.language].askToJoin[friend.isMale ? 1 : 0];
    await sendPushNotification(friend, title, body);
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
      null
    );
  };
  const sendPushNotificationForFriendsAboutWorkout = async (
    workoutSex,
    workoutType
  ) => {
    for (var friendId of Object.keys(user.friends)) {
      const friend = await firebase.getUserDataById(friendId);
      if (workoutSex == "everyone" || user.isMale == friend.isMale) {
        await sendFriendsWorkoutNotificationMessage(workoutType, friend);
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
        sendPushNotificationsForWorkoutMembers,
        sendPushNotificationUserLeftWorkout,
        sendPushNotificationForFriendsAboutWorkout,
        sendPushNotificationCreatorLeftWorkout,
        sendPushNotificationUserJoinedYouwWorkout,
        sendPushNotificationChatMessage,
        sendPushNotificationInviteFriendToWorkout,
        pushToken,
        setPushToken,
        notificationListenerFunction,
        schedulePushNotification,
        cancelScheduledPushNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
export default function usePushNotifications() {
  return useContext(NotificationsContext);
}
