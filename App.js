import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import { AuthPrvider } from "./hooks/useAuth";
import { NotificationsProvider } from "./hooks/usePushNotifications";
import { AlertsProvider } from "./hooks/useAlerts";

import { initGeocoder } from "./geocoder";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { NavbarNavigationProvider } from "./hooks/useNavbarNavigation";
import { NavbarDisplayProvider } from "./hooks/useNavbarDisplay";
import { CurrentWorkoutProvider } from "./hooks/useCurrentWorkout";
WebBrowser.maybeCompleteAuthSession();
if (Platform.OS != "web") {
  enableLatestRenderer = require("react-native-maps");
  enableLatestRenderer();
}
initGeocoder();
export default function App() {
  return (
    <NavigationContainer>
      <NavbarDisplayProvider>
        <AlertsProvider>
          <AuthPrvider>
            <CurrentWorkoutProvider>
              <NotificationsProvider>
                <NavbarNavigationProvider>
                  <TailwindProvider>
                    <StackNavigator />
                  </TailwindProvider>
                </NavbarNavigationProvider>
              </NotificationsProvider>
            </CurrentWorkoutProvider>
          </AuthPrvider>
        </AlertsProvider>
      </NavbarDisplayProvider>
    </NavigationContainer>
  );
}
