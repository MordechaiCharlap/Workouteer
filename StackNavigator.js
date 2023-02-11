import React, { useEffect, useState } from "react";
import { View, Platform, Text } from "react-native";
import BottomNavbar from "./components/BottomNavbar";
import HomeScreen from "./screens/HomeScreen";
import MyUserScreen from "./screens/MyUserScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import ExploreScreen from "./screens/ExploreScreen";
import FriendsScreen from "./screens/FriendsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatsScreen from "./screens/ChatsScreen";
import ChangePreferencesScreen from "./screens/ChangePreferencesScreen";
import SearchUsersScreen from "./screens/SearchUsersScreen";
import UserScreen from "./screens/UserScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import EditDataScreen from "./screens/EditDataScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ChatScreen from "./screens/ChatScreen";
import NewWorkoutScreen from "./screens/NewWorkoutScreen";
import FindWorkoutScreen from "./screens/FindWorkoutScreen";
import FutureWorkoutsScreen from "./screens/FutureWorkoutsScreen";
import PastWorkoutsScreen from "./screens/PastWorkoutsScreen";
import WorkoutDetailsScreen from "./screens/WorkoutDetailsScreen";
import WorkoutRequestsScreen from "./screens/WorkoutRequestsScreen";
import SearchedWorkoutsScreen from "./screens/SearchedWorkoutsScreen";
import FriendsWorkoutsScreen from "./screens/FriendsWorkoutsScreen";
import InviteFriendsScreen from "./screens/InviteFriendsScreen";
import usePushNotifications from "./hooks/usePushNotifications";
import useAuth from "./hooks/useAuth";
import useAlerts from "./hooks/useAlerts";
import * as firebase from "./services/firebase";
import WorkoutInvitesScreen from "./screens/WorkoutInvitesScreen";
import useNavbarNavigation from "./hooks/useNavbarNavigation";
import FriendRequestsScreen from "./screens/FriendRequestsScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import useNavbarDisplay from "./hooks/useNavbarDisplay";
import { useNavigationState } from "@react-navigation/native";
const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  const { user, addAuthObserver, googleUserInfo, setGoogleUserAsync } =
    useAuth();
  const {
    myUserNavigationOptions,
    leaderboardNavigationOptions,
    homeNavigationOptions,
    chatsNavigationOptions,
    exploreNavigationOptions,
  } = useNavbarNavigation();
  const { showNavbar, setShowNavbar, setCurrentScreen } = useNavbarDisplay();
  const { notificationListenerFunction } = usePushNotifications();
  const { workoutRequestsAlerts, newWorkoutsAlerts, workoutInvitesAlerts } =
    useAlerts();
  const [alertsChanged, setAlertsChanged] = useState(false);
  const [notificationsListenersAdded, setNotificationsListenersAdded] =
    useState(false);

  useEffect(() => {
    addAuthObserver();
    console.log("StackRendered");
  }, []);

  useEffect(() => {
    if (googleUserInfo) {
      setGoogleUserAsync();
    }
  }, [googleUserInfo]);

  useEffect(() => {
    const resetStreakIfNeeded = async () => {
      var yasterday = new Date();
      yasterday.setDate(new Date(yasterday).getDate() - 1);
      yasterday.setHours(0, 0, 0, 0);
      if (
        user.streak != 0 &&
        user.lastConfirmedWorkoutDate.toDate() < yasterday
      ) {
        const updatedUser = { ...user };
        updatedUser.streak = 0;
        await firebase.updateUser(updatedUser);
      }
    };
    const addListenerAsync = async () => {
      await notificationListenerFunction();
    };
    if (!notificationsListenersAdded && user != null && Platform.OS != "web") {
      setNotificationsListenersAdded(true);
      addListenerAsync(user);
    }
    if (user) {
      resetStreakIfNeeded();
    }
  }, [user]);
  useEffect(() => {
    const removingBadWorkoutAlerts = async () => {
      await firebase.removePastOrEmptyWorkoutsAlerts(
        workoutRequestsAlerts,
        newWorkoutsAlerts,
        workoutInvitesAlerts,
        user.id
      );
    };
    if (user && alertsChanged) {
      removingBadWorkoutAlerts();
      setAlertsChanged(false);
    }
  }, [alertsChanged, user]);
  useEffect(() => {
    if (workoutInvitesAlerts != null) setAlertsChanged(true);
  }, [workoutInvitesAlerts]);
  //listening to invites because its updating after requests, so when invites updating request are updated already
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={homeNavigationOptions.current}
            />

            <Stack.Screen
              name="MyUser"
              component={MyUserScreen}
              options={myUserNavigationOptions.current}
            />
            <Stack.Screen
              name="User"
              component={UserScreen}
              options={verticalAnimation}
            />
            <Stack.Screen
              name="Explore"
              component={ExploreScreen}
              options={exploreNavigationOptions.current}
            />
            <Stack.Screen
              name="Friends"
              component={FriendsScreen}
              options={verticalAnimation}
            />
            <Stack.Screen
              name="Chats"
              component={ChatsScreen}
              options={chatsNavigationOptions.current}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={verticalAnimation}
            />
            {/* <Stack.Screen
            name="Calendar"
            component={CalendarScreen}
            options={leaderboardNavigationOptions.current}
          /> */}
            <Stack.Screen
              name="Leaderboard"
              component={LeaderboardScreen}
              options={leaderboardNavigationOptions.current}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={verticalAnimation}
            />
            <Stack.Screen
              name="SearchUsers"
              component={SearchUsersScreen}
              options={verticalAnimation}
            />
            <Stack.Screen
              name="EditData"
              component={EditDataScreen}
              options={verticalAnimation}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={verticalAnimation}
            />
            <Stack.Screen
              name="FriendsWorkouts"
              component={FriendsWorkoutsScreen}
              options={verticalAnimation}
            />
            <Stack.Screen
              name="NewWorkout"
              component={NewWorkoutScreen}
              options={verticalAnimation}
            />
            <Stack.Screen
              name="FindWorkout"
              component={FindWorkoutScreen}
              options={verticalAnimation}
            />
            <Stack.Screen
              name="FutureWorkouts"
              component={FutureWorkoutsScreen}
              options={verticalAnimation}
            />
            <Stack.Screen
              name="PastWorkouts"
              component={PastWorkoutsScreen}
              options={verticalAnimation}
            />
            <Stack.Screen
              name="WorkoutInvites"
              component={WorkoutInvitesScreen}
              options={verticalAnimation}
            />
            <Stack.Screen
              name="ChangePreferences"
              component={ChangePreferencesScreen}
              options={verticalAnimation}
            />
            <Stack.Screen
              name="SearchedWorkouts"
              component={SearchedWorkoutsScreen}
              options={horizontalRightAnimation}
            />
            <Stack.Screen
              name="WorkoutDetails"
              component={WorkoutDetailsScreen}
              options={horizontalRightAnimation}
            />
            <Stack.Screen
              name="WorkoutRequests"
              component={WorkoutRequestsScreen}
              options={horizontalRightAnimation}
            />
            <Stack.Screen
              name="InviteFriends"
              component={InviteFriendsScreen}
              options={horizontalRightAnimation}
            />
            <Stack.Screen
              name="FriendRequests"
              component={FriendRequestsScreen}
              options={verticalAnimation}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={verticalAnimation}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={horizontalLeftAnimation}
            />
          </>
        )}
      </Stack.Navigator>
      {showNavbar && (
        <View>
          <BottomNavbar height={50} />
        </View>
      )}
    </View>
  );
};
const verticalAnimation = () => {
  const options = {
    headerShown: false,
    animation: "slide_from_bottom",
    animationTypeForReplace: "push",
  };
  return options;
};
const horizontalRightAnimation = () => {
  const options = {
    headerShown: false,
    animation: "slide_from_right",
    animationTypeForReplace: "push",
  };
  return options;
};
const horizontalLeftAnimation = () => {
  const options = {
    headerShown: false,
    animation: "slide_from_left",
    animationTypeForReplace: "push",
  };
  return options;
};
export default StackNavigator;
