import "react-native-gesture-handler";
import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import { AuthPrvider } from "./hooks/useAuth";
import { AlertsProvider } from "./hooks/useAlerts";
import { NotificationsProvider } from "./hooks/usePushNotifications";
import { enableLatestRenderer } from "react-native-maps";
import { initGeocoder } from "./geocoder";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
WebBrowser.maybeCompleteAuthSession();
if (Platform.OS != "web") enableLatestRenderer();
initGeocoder();
export default function App() {
  return (
    <NavigationContainer>
      <AuthPrvider>
        <NotificationsProvider>
          <AlertsProvider>
            <TailwindProvider>
              <StackNavigator />
            </TailwindProvider>
          </AlertsProvider>
        </NotificationsProvider>
      </AuthPrvider>
    </NavigationContainer>
  );
}
