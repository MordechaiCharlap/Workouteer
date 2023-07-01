import { View } from "react-native";
import { React, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as firebase from "../services/firebase";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
import useAlerts from "../hooks/useAlerts";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import Profile from "../components/Profile";
import useAuth from "../hooks/useAuth";

const MyProfileScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { user } = useAuth();
  const { setScreen } = useNavbarNavigation();
  const { friendRequestsAlerts, setFriendRequestsAlerts } = useAlerts();

  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("MyProfile");
      setScreen("MyProfile");

      const cleanFriendRequestsAlerts = async () => {
        await firebase.removeAllFriendRequestAlerts(user.id);
      };
      if (Object.keys(friendRequestsAlerts).length > 0) {
        setFriendRequestsAlerts({});
        cleanFriendRequestsAlerts();
      }
    }, [])
  );

  return (
    <View style={safeAreaStyle()}>
      <Profile isMyUser={true} shownUser={user} />
    </View>
  );
};
export default MyProfileScreen;
