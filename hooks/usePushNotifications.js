import { createContext, useState, useRef, useContext, useEffect } from "react";
import * as Device from "expo-device";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as firebase from "../services/firebase";
import useAuth from "./useAuth";
import languageService from "../services/languageService";
import { doc, updateDoc } from "firebase/firestore";
import useFirebase from "./useFirebase";
const NotificationsContext = createContext();
export const NotificationsProvider = ({ children }) => {
  const { db } = useFirebase();
  const clearNotifications = async () => {
    const presentedNotifications =
      await Notifications.getPresentedNotificationsAsync();
    presentedNotifications.forEach(async (notification) => {
      await Notifications.dismissNotificationAsync(
        notification.request.identifier
      );
    });
  };
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  const notificationListener = useRef();
  const responseListener = useRef();
  const { user, userLoaded, rememberMe } = useAuth();
  const clearListeners = () => {
    if (notificationListener.current != null) {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      if (responseListener.current != null) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    }
  };
  useEffect(() => {
    const clearAsyncNotifications = async () => {
      await clearNotifications();
    };
    if (Platform.OS != "web" && Device.isDevice) clearAsyncNotifications();
  }, []);
  useEffect(() => {
    const addListenerAsync = async () => {
      await notificationListenerFunction();
    };
    if (!userLoaded || Platform.OS == "web") {
      clearListeners();
    } else if (rememberMe) addListenerAsync();
    return () => {
      clearListeners();
    };
  }, [userLoaded]);
  const notificationListenerFunction = async () => {
    if (Platform.OS != "web" && Device.isDevice) {
      const deviceToken = await registerForPushNotificationsAsync();
      if (deviceToken && deviceToken != user.token) {
        tokenUpdateLogic(deviceToken);
      }

      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {});

      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {});
    }
  };
  async function registerForPushNotificationsAsync() {
    let token;
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    return token;
  }
  const tokenUpdateLogic = (token) => {
    firebase.deletePushTokenForUserWhoIsNotMe(user.id, token);
    setTimeout(() => {
      updateDoc(doc(db, `users/${user.id}`), { pushToken: token });
    }, 5000);
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
    if (Platform.OS == "web") return;
    if (userToSend.pushToken) {
      const pushNotification = {
        to: userToSend.pushToken,
        sound: "default",
        title: "",
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
    </NotificationsContext.Provider>
  );
};
export default function usePushNotifications() {
  return useContext(NotificationsContext);
}
