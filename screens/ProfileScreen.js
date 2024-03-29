import { View } from "react-native";
import { React, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import useNavbarDisplay from "../hooks/useNavbarDisplay";
import Profile from "../components/profileScreen/Profile";
import { safeAreaStyle } from "../components/safeAreaStyle";

const ProfileScreen = ({ route }) => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Profile");
    }, [])
  );
  return (
    <View style={safeAreaStyle()}>
      <Profile isMyUser={false} shownUser={route.params.shownUser} />
    </View>
  );
};
export default ProfileScreen;
