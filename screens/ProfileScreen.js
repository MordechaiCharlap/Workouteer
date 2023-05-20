import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { React, useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import * as appStyle from "../utilities/appStyleSheet";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import languageService from "../services/languageService";
import AwesomeModal from "../components/AwesomeModal";
import Profile from "../components/Profile";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft, faShield } from "@fortawesome/free-solid-svg-icons";

const ProfileScreen = ({ route }) => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Profile");
    }, [])
  );
  return (
    <Profile
      isMyUser={false}
      shownUser={route.params.shownUser}
      initialFriendshipStatus={route.params.friendshipStatus}
    />
  );
};
export default ProfileScreen;
