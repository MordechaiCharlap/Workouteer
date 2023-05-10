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
import { WebResponsivenessProvider } from "./hooks/useWebResponsiveness";
import { FriendsWorkoutsProvider } from "./hooks/useFriendsWorkouts";
import { LeaderboardUpdatesProvider } from "./hooks/useLeaderboardUpdates";
import { ConfirmedWorkoutsProvider } from "./hooks/useConfirmedWorkouts";
import { AppDataProvider } from "./hooks/useAppData";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Timestamp, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "./services/firebase";
SplashScreen.preventAutoHideAsync();
WebBrowser.maybeCompleteAuthSession();
if (Platform.OS != "web") {
  const { enableLatestRenderer } = require("react-native-maps");
  enableLatestRenderer();
}
initGeocoder();

export default function App() {
  useEffect(() => {
    const trackWebsiteView = async () => {
      await updateDoc(doc(db, "appData/website"), {
        views: arrayUnion(Timestamp.now()),
      });
    };
    if (Platform.OS == "web") trackWebsiteView();
  }, []);

  return (
    <NavigationContainer>
      <AppDataProvider>
        <AuthPrvider>
          <WebResponsivenessProvider>
            <NavbarDisplayProvider>
              <AlertsProvider>
                <CurrentWorkoutProvider>
                  <FriendsWorkoutsProvider>
                    <NotificationsProvider>
                      <LeaderboardUpdatesProvider>
                        <ConfirmedWorkoutsProvider>
                          <NavbarNavigationProvider>
                            <TailwindProvider>
                              <StackNavigator />
                            </TailwindProvider>
                          </NavbarNavigationProvider>
                        </ConfirmedWorkoutsProvider>
                      </LeaderboardUpdatesProvider>
                    </NotificationsProvider>
                  </FriendsWorkoutsProvider>
                </CurrentWorkoutProvider>
              </AlertsProvider>
            </NavbarDisplayProvider>
          </WebResponsivenessProvider>
        </AuthPrvider>
      </AppDataProvider>
    </NavigationContainer>
  );
}
