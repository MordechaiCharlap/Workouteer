import { createContext, useState, useRef, useEffect, useContext } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as firebase from "../services/firebase";
import useAuth from "./useAuth";
const NotificationsContext = createContext();
export const NotificationsProvider = ({ children }) => {
  const [pushToken, setPushToken] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();
  const { user, setUser } = useAuth();
  const registerForPushNotifications = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        console.log("not granted");
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      if (!user.pushToken) {
        console.log("no pushToken in firestore, adding push token now");
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        const updatedUser = { ...user, pushToken: token };
        await firebase.updateUser(updatedUser);
        setUser(await firebase.updateContext(user.usernameLower));
        setPushToken(token);
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }
  };
  useEffect(() => {
    registerForPushNotifications();
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
        console.log(response);
      });

    return () => {
      if (responseListener) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
    };
  }, [user]);
  const sendPushNotification = async (user, title, body, data) => {
    const message = {
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
      body: JSON.stringify(message),
    });
    console.log("message: ", message);
  };

  return (
    <NotificationsContext.Provider
      value={{
        sendPushNotification,
        pushToken,
        setPushToken,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
export default function useNotifications() {
  return useContext(NotificationsContext);
}
