import { createContext, useState, useRef, useEffect, useContext } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
const NotificationsContext = createContext();
export const NotificationsProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    const registerForPushNotifications = async () => {
      if (Device.isDevice) {
        var status = await Notifications.getPermissionsAsync();
        if (status !== "granted") {
          status = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        } else console.log("notification permission granted");
        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log("token:", token);
        setExpoPushToken(token);
      } else {
        alert("Must use physical device for Push Notifications");
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
    registerForPushNotifications();
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  const sendPushNotification = async () => {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Original Title",
      body: "And here is the body!",
      data: { someData: "goes here" },
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
    console.log(message);
  };

  return (
    <NotificationsContext.Provider
      value={{
        sendPushNotification,
        expoPushToken,
        setExpoPushToken,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
export default function useNotifications() {
  return useContext(NotificationsContext);
}
