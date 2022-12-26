import { createContext } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
const NotificationsContext = createContext();
export const NotificationsProvider = ({ children }) => {
  registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
      this.setState({ expoPushToken: token });
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
  return (
    <NotificationsContext.Provider
      value={{
        registerForPushNotificationsAsync,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
export default function useNotifications() {
  return useContext(NotificationsContext);
}
