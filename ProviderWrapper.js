import { TailwindProvider } from "tailwindcss-react-native";
import { AuthPrvider } from "./hooks/useAuth";
import { NotificationsProvider } from "./hooks/usePushNotifications";
import { AlertsProvider } from "./hooks/useAlerts";
import { NavbarNavigationProvider } from "./hooks/useNavbarNavigation";
import { NavbarDisplayProvider } from "./hooks/useNavbarDisplay";
import { CurrentWorkoutProvider } from "./hooks/useCurrentWorkout";
import { ResponsivenessProvider } from "./hooks/useResponsiveness";
import { FriendsWorkoutsProvider } from "./hooks/useFriendsWorkouts";
import { LeaderboardProvider } from "./hooks/useLeaderboard";
import { ConfirmedWorkoutsProvider } from "./hooks/useConfirmedWorkouts";
import { AppDataProvider } from "./hooks/useAppData";
import { WorkoutLogicProvider } from "./hooks/useWorkoutLogic";
import { ConnectionProvider } from "./hooks/useConnection";
import { FirebaseProvider } from "./hooks/useFirebase";
import { ChatsProvider } from "./hooks/useChats";
import { ExploreProvider } from "./hooks/useExplore";
import { FriendRequestsProvider } from "./hooks/useFriendRequests";
const ProviderWrapper = ({ children }) => {
  return (
    <FirebaseProvider>
      <AuthPrvider>
        <AppDataProvider>
          <ResponsivenessProvider>
            <ConnectionProvider>
              <NavbarDisplayProvider>
                <AlertsProvider>
                  <FriendRequestsProvider>
                    <ChatsProvider>
                      <CurrentWorkoutProvider>
                        <FriendsWorkoutsProvider>
                          <NotificationsProvider>
                            <LeaderboardProvider>
                              <ExploreProvider>
                                <ConfirmedWorkoutsProvider>
                                  <WorkoutLogicProvider>
                                    <NavbarNavigationProvider>
                                      <TailwindProvider>
                                        {children}
                                      </TailwindProvider>
                                    </NavbarNavigationProvider>
                                  </WorkoutLogicProvider>
                                </ConfirmedWorkoutsProvider>
                              </ExploreProvider>
                            </LeaderboardProvider>
                          </NotificationsProvider>
                        </FriendsWorkoutsProvider>
                      </CurrentWorkoutProvider>
                    </ChatsProvider>
                  </FriendRequestsProvider>
                </AlertsProvider>
              </NavbarDisplayProvider>
            </ConnectionProvider>
          </ResponsivenessProvider>
        </AppDataProvider>
      </AuthPrvider>
    </FirebaseProvider>
  );
};

export default ProviderWrapper;
