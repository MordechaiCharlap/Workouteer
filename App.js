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
import { ResponsivenessProvider } from "./hooks/useResponsiveness";
import { FriendsWorkoutsProvider } from "./hooks/useFriendsWorkouts";
import { LeaderboardUpdatesProvider } from "./hooks/useLeaderboardUpdates";
import { ConfirmedWorkoutsProvider } from "./hooks/useConfirmedWorkouts";
import { AppDataProvider } from "./hooks/useAppData";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Timestamp, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "./services/firebase";
import { WorkoutLogicProvider } from "./hooks/useWorkoutLogic";
import { ConnectionProvider } from "./hooks/useConnection";

export default function App() {
  SplashScreen.preventAutoHideAsync();
  WebBrowser.maybeCompleteAuthSession();
  if (Platform.OS != "web") {
    const { enableLatestRenderer } = require("react-native-maps");
    enableLatestRenderer();
  }
  initGeocoder();

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        const trackWebsiteView = async () => {
          await updateDoc(doc(db, "appData/website"), {
            views: arrayUnion(Timestamp.now()),
          });
        };
        if (Platform.OS == "web" && data.ip != "77.137.70.233")
          trackWebsiteView();
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <NavigationContainer>
      <AppDataProvider>
        <AuthPrvider>
          <ResponsivenessProvider>
            <ConnectionProvider>
              <NavbarDisplayProvider>
                <AlertsProvider>
                  <CurrentWorkoutProvider>
                    <FriendsWorkoutsProvider>
                      <NotificationsProvider>
                        <LeaderboardUpdatesProvider>
                          <ConfirmedWorkoutsProvider>
                            <WorkoutLogicProvider>
                              <NavbarNavigationProvider>
                                <TailwindProvider>
                                  <StackNavigator />
                                </TailwindProvider>
                              </NavbarNavigationProvider>
                            </WorkoutLogicProvider>
                          </ConfirmedWorkoutsProvider>
                        </LeaderboardUpdatesProvider>
                      </NotificationsProvider>
                    </FriendsWorkoutsProvider>
                  </CurrentWorkoutProvider>
                </AlertsProvider>
              </NavbarDisplayProvider>
            </ConnectionProvider>
          </ResponsivenessProvider>
        </AuthPrvider>
      </AppDataProvider>
    </NavigationContainer>
  );
}
