import React, { useEffect, useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import MyUserScreen from "./screens/MyUserScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import ExploreScreen from "./screens/ExploreScreen";
import FriendsScreen from "./screens/FriendsScreen";
import CalendarScreen from "./screens/CalendarScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatsScreen from "./screens/ChatsScreen";
import PersonalDataScreen from "./screens/PersonalDataScreen";
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
const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  const { user, addObserver } = useAuth();
  const {
    myUserNavigationOptions,
    calendarNavigationOptions,
    homeNavigationOptions,
    chatsNavigationOptions,
    exploreNavigationOptions,
  } = useNavbarNavigation();
  const { notificationListenerFunction } = usePushNotifications();
  const { workoutRequestsAlerts, workoutInvitesAlerts } = useAlerts();
  const [alertsChanged, setAlertsChanged] = useState(false);
  const [notificationsListenersAdded, setNotificationsListenersAdded] =
    useState(false);
  useEffect(() => {
    addObserver();
  }, []);
  useEffect(() => {
    const addListenerAsync = async () => {
      await notificationListenerFunction();
    };
    if (!notificationsListenersAdded && user != null) {
      setNotificationsListenersAdded(true);
      addListenerAsync(user);
    }
  }, [user]);
  useEffect(() => {
    const removingBadWorkoutAlerts = async () => {
      await firebase.removePastOrEmptyWorkoutsAlerts(
        workoutRequestsAlerts,
        workoutInvitesAlerts,
        user.id
      );
    };
    if (user && alertsChanged) {
      removingBadWorkoutAlerts();
      setAlertsChanged(false);
    }
    //listening to invites because its updating after requests, so when invites updating request are updated already
  }, [alertsChanged, user]);
  useEffect(() => {
    if (workoutInvitesAlerts != null) setAlertsChanged(true);
  }, [workoutInvitesAlerts]);
  return (
    <Stack.Navigator>
      {user && user.defaultCountry != null ? (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={homeNavigationOptions}
          />

          <Stack.Screen
            name="MyUser"
            component={MyUserScreen}
            options={myUserNavigationOptions}
          />
          <Stack.Screen name="User" component={UserScreen} />
          <Stack.Screen
            name="Explore"
            component={ExploreScreen}
            options={exploreNavigationOptions}
          />
          <Stack.Screen
            name="Friends"
            component={FriendsScreen}
            options={verticalAnimation}
          />
          <Stack.Screen
            name="Chats"
            component={ChatsScreen}
            options={chatsNavigationOptions}
          />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen
            name="Calendar"
            component={CalendarScreen}
            options={calendarNavigationOptions}
          />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="SearchUsers" component={SearchUsersScreen} />
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
          />
          <Stack.Screen
            name="SearchedWorkouts"
            options={horizontalRightAnimation}
            component={SearchedWorkoutsScreen}
          />
          <Stack.Screen
            name="WorkoutDetails"
            options={horizontalRightAnimation}
            component={WorkoutDetailsScreen}
          />
          <Stack.Screen
            name="WorkoutRequests"
            options={horizontalRightAnimation}
            component={WorkoutRequestsScreen}
          />
          <Stack.Screen
            name="InviteFriends"
            options={horizontalRightAnimation}
            component={InviteFriendsScreen}
          />
        </>
      ) : user && user.defaultCountry == null ? (
        <Stack.Screen name="PersonalData" component={PersonalDataScreen} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
const verticalAnimation = () => {
  const options = {
    animation: "slide_from_bottom",
    animationTypeForReplace: "push",
  };
  return options;
};
const horizontalRightAnimation = () => {
  const options = {
    animation: "slide_from_right",
    animationTypeForReplace: "push",
  };
  return options;
};
const horizontalLeftAnimation = () => {
  const options = {
    animation: "slide_from_left",
    animationTypeForReplace: "push",
  };
  return options;
};
export default StackNavigator;
