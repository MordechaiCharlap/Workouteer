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
import { WorkoutLogicProvider } from "./hooks/useWorkoutLogic";
import { ConnectionProvider } from "./hooks/useConnection";
import { MaintenanceProvider } from "./hooks/useMaintenance";

export default function App() {
  SplashScreen.preventAutoHideAsync();
  WebBrowser.maybeCompleteAuthSession();
  if (Platform.OS != "web") {
    const { enableLatestRenderer } = require("react-native-maps");
    enableLatestRenderer();
  }
  initGeocoder();

  return (
    <NavigationContainer>
      <AppDataProvider>
        <MaintenanceProvider>
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
        </MaintenanceProvider>
      </AppDataProvider>
    </NavigationContainer>
  );
}
