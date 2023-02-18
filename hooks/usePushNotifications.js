import { createContext, useState, useRef, useEffect, useContext } from "react";
import * as Device from "expo-device";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as firebase from "../services/firebase";
import useAuth from "./useAuth";
const NotificationsContext = createContext();
export const NotificationsProvider = ({ children }) => {
  const [pushToken, setPushToken] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();
  const { user, setUser } = useAuth();
  const notificationListenerFunction = async () => {
    if (Platform.OS != "web") {
      console.log("registering for notifications");
      await registerForPushNotifications();
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("notification: ", notification);
        });

      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log("response: ", response);
        });

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
    if (Platform.OS != "web") {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        console.log("not granted");
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.log("Notification permission not granted");
        return;
      }
      console.log("Notification permission granted");
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
      if (token && token != user.token) {
        const updatedUser = { ...user, pushToken: token };
        await firebase.updateUser(updatedUser);
        setPushToken(token);
      }
    } else {
      // Must use physical device for Push Notifications
    }
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
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
        console.log("pushNotification: ", pushNotification);
      }
    }
  };
  const sendPushNotification = async (user, title, body, data) => {
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
      console.log("pushNotification: ", pushNotification);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        sendPushNotification,
        sendPushNotificationsForWorkoutMembers,
        pushToken,
        setPushToken,
        notificationListenerFunction,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
export default function usePushNotifications() {
  return useContext(NotificationsContext);
}
