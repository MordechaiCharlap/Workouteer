import React, { useEffect, useState } from "react";
import { View, Platform, StatusBar } from "react-native";
import * as appStyle from "./utils/appStyleSheet";
import BottomNavbar from "./components/BottomNavbar";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import ExploreScreen from "./screens/ExploreScreen";
import FriendsScreen from "./screens/FriendsScreen";
import ChatsScreen from "./screens/ChatsScreen";
import ChangePreferencesScreen from "./screens/ChangePreferencesScreen";
import SearchUsersScreen from "./screens/SearchUsersScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import EditDataScreen from "./screens/EditDataScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ChatScreen from "./screens/ChatScreen";
import FutureWorkoutsScreen from "./screens/FutureWorkoutsScreen";
import PastWorkoutsScreen from "./screens/PastWorkoutsScreen";
import WorkoutDetailsScreen from "./screens/WorkoutDetailsScreen";
import WorkoutRequestsScreen from "./screens/WorkoutRequestsScreen";
import SearchedWorkoutsScreen from "./screens/SearchedWorkoutsScreen";
import FriendsWorkoutsScreen from "./screens/FriendsWorkoutsScreen";
import InviteFriendsScreen from "./screens/InviteFriendsScreen";
import useAuth from "./hooks/useAuth";
import * as firebase from "./services/firebase";
import WorkoutInvitesScreen from "./screens/WorkoutInvitesScreen";
import useNavbarNavigation from "./hooks/useNavbarNavigation";
import FriendRequestsScreen from "./screens/FriendRequestsScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import UpdateAppScreen from "./screens/UpdateAppScreen";
import LandscapeOrientationScreen from "./screens/LandscapeOrientationScreen";
import useNavbarDisplay from "./hooks/useNavbarDisplay";
import useResponsiveness from "./hooks/useResponsiveness";
import WindowTooSmallScreen from "./screens/WindowTooSmallScreen";
import ConfirmWorkoutScreen from "./screens/ConfirmWorkoutScreen";
import LinkUserWithGoogleScreen from "./screens/LinkUserWithGoogleScreen";
import { safeAreaStyle } from "./components/safeAreaStyle";
import TermsOfServiceScreen from "./screens/TermsOfServiceScreen";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";
import useAppData from "./hooks/useAppData";
import ReportUserScreen from "./screens/ReportUserScreen";
import SearchWorkoutsScreen from "./screens/SearchWorkoutsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateWorkoutScreen from "./screens/CreateWorkoutScreen";
import MyProfileScreen from "./screens/MyProfileScreen";
import UnderMaintenanceScreen from "./screens/UnderMaintenanceScreen";
import IntervalTimerScreen from "./screens/IntervalTimerScreen";
import { isWebOnPC } from "./services/webScreenService";
import ControlPanelScreen from "./screens/adminScreens/ControlPanelScreen";
import useFirebase from "./hooks/useFirebase";
import { doc, updateDoc } from "firebase/firestore";
import WorkoutProgramsScreen from "./screens/WorkoutProgramsScreen";
import WorkoutProgramScreen from "./screens/WorkoutProgramScreen";
import CreateWorkoutProgramScreen from "./screens/CreateWorkoutProgramScreen";
import TimerScreen from "./screens/TimerScreen";
import EditWorkoutProgramScreen from "./screens/EditWorkoutProgramScreen";
import SuggestionsAndBugsScreen from "./screens/adminScreens/SuggestionsAndBugsScreen";
import TestScreen from "./screens/adminScreens/TestScreen";
import { removeBadPlannedWorkoutsAndReturnFixed } from "./utils/workoutUtils";
import WorkoutNotFoundScreen from "./screens/WorkoutNotFoundScreen";
import SearchWorkoutProgramsScreen from "./screens/SearchWorkoutProgramsScreen";
const Stack = createNativeStackNavigator();
const StackNavigator = () => {
  const { user, userLoaded } = useAuth();
  const { db } = useFirebase();
  const {
    myUserNavigationOptions,
    leaderboardNavigationOptions,
    homeNavigationOptions,
    chatsNavigationOptions,
    exploreNavigationOptions,
  } = useNavbarNavigation();
  const { showNavbar } = useNavbarDisplay();
  const { orientation, windowTooSmall } = useResponsiveness();
  const { isVersionUpToDate, underMaintenance } = useAppData();

  const resetStreakIfNeeded = () => {
    var yasterday = new Date();
    yasterday.setDate(new Date(yasterday).getDate() - 1);
    yasterday.setHours(0, 0, 0, 0);
    if (
      user.streak != 0 &&
      user.lastConfirmedWorkoutDate.toDate() < yasterday
    ) {
      return 0;
    } else return user.streak;
  };
  useEffect(() => {
    if (userLoaded) {
      const newPlannedWorkouts = removeBadPlannedWorkoutsAndReturnFixed(user);
      const newStreak = resetStreakIfNeeded();
      const userClone = { ...user };
      userClone.streak = newStreak;
      userClone.plannedWorkouts = newPlannedWorkouts;
      updateDoc(doc(db, "users", userClone.id), userClone);
    }
  }, [userLoaded]);
  //listening to invites because its updating after requests, so when invites updating request are updated already
  return (
    <View
      style={[
        { flex: 1 },
        isWebOnPC && { width: "100%", alignItems: "center" },
      ]}
    >
      <View
        style={[
          { flex: 1 },
          isWebOnPC && {
            borderWidth: 0.5,
            borderColor: appStyle.color_outline,
          },
        ]}
      >
        <View style={safeAreaStyle()}>
          <StatusBar
            backgroundColor={appStyle.statusBarStyle.backgroundColor}
            barStyle={appStyle.statusBarStyle.barStyle}
          />
          <Stack.Navigator screenOptions={{ headerShown: true }}>
            {orientation == "LANDSCAPE" ? (
              <Stack.Screen
                name="LandscapeOrientationScreen"
                component={LandscapeOrientationScreen}
                options={verticalAnimation}
              />
            ) : windowTooSmall ? (
              <Stack.Screen
                name="WindowTooSmallScreen"
                component={WindowTooSmallScreen}
                options={verticalAnimation}
              />
            ) : !isVersionUpToDate ? (
              <Stack.Screen
                name="UpdateApp"
                component={UpdateAppScreen}
                options={verticalAnimation}
              />
            ) : //     : !connected ? (
            // <Stack.Screen
            //   name="ConnectToInternet"
            //   component={ConnectToInternetScreen}
            //   options={verticalAnimation}
            // />
            //     )
            underMaintenance == true ? (
              <Stack.Screen
                name="UnderMaintenance"
                component={UnderMaintenanceScreen}
                options={verticalAnimation}
              />
            ) : user ? (
              <>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={homeNavigationOptions.current}
                />
                <Stack.Screen
                  name="MyProfile"
                  component={MyProfileScreen}
                  options={myUserNavigationOptions.current}
                />
                <Stack.Screen
                  name="Profile"
                  component={ProfileScreen}
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
                  name="CreateWorkout"
                  component={CreateWorkoutScreen}
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
                <Stack.Screen
                  name="ConfirmWorkout"
                  component={ConfirmWorkoutScreen}
                  options={verticalAnimation}
                />
                <Stack.Screen
                  name="ReportUser"
                  component={ReportUserScreen}
                  options={verticalAnimation}
                />
                <Stack.Screen
                  name="SearchWorkouts"
                  component={SearchWorkoutsScreen}
                  options={verticalAnimation}
                />
                <Stack.Screen
                  name="IntervalTimer"
                  component={IntervalTimerScreen}
                  options={verticalAnimation}
                />
                <Stack.Screen
                  name="Timer"
                  component={TimerScreen}
                  options={verticalAnimation}
                />
                <Stack.Screen
                  name="WorkoutPrograms"
                  component={WorkoutProgramsScreen}
                  options={verticalAnimation}
                />
                <Stack.Screen
                  name="WorkoutProgram"
                  component={WorkoutProgramScreen}
                  options={verticalAnimation}
                />
                <Stack.Screen
                  name="CreateWorkoutProgram"
                  component={CreateWorkoutProgramScreen}
                  options={verticalAnimation}
                />
                <Stack.Screen
                  name="EditWorkoutProgram"
                  component={EditWorkoutProgramScreen}
                  options={verticalAnimation}
                />
                <Stack.Screen
                  name="WorkoutNotFound"
                  component={WorkoutNotFoundScreen}
                  options={verticalAnimation}
                />
                <Stack.Screen
                  name="SearchWorkoutPrograms"
                  component={SearchWorkoutProgramsScreen}
                  options={verticalAnimation}
                />
                {user.role == "admin" && (
                  <>
                    <Stack.Screen
                      name="ControlPanel"
                      component={ControlPanelScreen}
                      options={verticalAnimation}
                    />
                    <Stack.Screen
                      name="SuggestionsAndBugs"
                      component={SuggestionsAndBugsScreen}
                      options={verticalAnimation}
                    />
                    <Stack.Screen
                      name="Test"
                      component={TestScreen}
                      options={verticalAnimation}
                    />
                  </>
                )}
              </>
            ) : (
              !user && (
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
                  <Stack.Screen
                    name="LinkUserWithGoogle"
                    component={LinkUserWithGoogleScreen}
                    options={horizontalLeftAnimation}
                  />
                </>
              )
            )}
            <Stack.Screen
              name="TermsOfService"
              component={TermsOfServiceScreen}
              options={verticalAnimation}
            />
            <Stack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicyScreen}
              options={verticalAnimation}
            />
          </Stack.Navigator>
        </View>
        {showNavbar && <BottomNavbar />}
      </View>
    </View>
  );
};

const noAnimation = {
  headerShown: false,
  animation: "none",
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
