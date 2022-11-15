import React from "react";
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
import SearchWorkoutScreen from "./screens/SearchWorkoutScreen";
import useAuth from "./hooks/useAuth";
const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { user } = useAuth();
  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="PersonalData" component={PersonalDataScreen} />
          <Stack.Screen name="MyUser" component={MyUserScreen} />
          <Stack.Screen name="User" component={UserScreen} />
          <Stack.Screen name="Explore" component={ExploreScreen} />
          <Stack.Screen name="Friends" component={FriendsScreen} />
          <Stack.Screen name="Chats" component={ChatsScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="SearchUsers" component={SearchUsersScreen} />
          <Stack.Screen name="EditData" component={EditDataScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="NewWorkout" component={NewWorkoutScreen} />
          <Stack.Screen name="SearchWorkout" component={SearchWorkoutScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}

      <Stack.Screen
        name="ChangePreferences"
        component={ChangePreferencesScreen}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
