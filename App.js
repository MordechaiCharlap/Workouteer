import "react-native-gesture-handler";
import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import { AuthPrvider } from "./hooks/useAuth";
import { NotificationsProvider } from "./hooks/useNotifications";
import { enableLatestRenderer } from "react-native-maps";
import { initGeocoder } from "./geocoder";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

export default function App() {
  WebBrowser.maybeCompleteAuthSession();
  if (Platform.OS != "web") enableLatestRenderer();
  initGeocoder();

  return (
    <NavigationContainer>
      <AuthPrvider>
        <NotificationsProvider>
          <TailwindProvider>
            <StackNavigator />
          </TailwindProvider>
        </NotificationsProvider>
      </AuthPrvider>
    </NavigationContainer>
  );
}
