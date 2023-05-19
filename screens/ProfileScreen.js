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
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as appStyle from "../utilities/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronLeft,
  faUserGroup,
  faDumbbell,
  faPaperPlane,
  faUserMinus,
  faUserPlus,
  faUserXmark,
  faCheck,
  faX,
  faShield,
  faClock,
  faExclamationCircle,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
import usePushNotifications from "../hooks/usePushNotifications";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import languageService from "../services/languageService";
import NameAndAge from "../components/profileScreen/NameAndAge";
import UserStats from "../components/profileScreen/UserStats";
import AwesomeModal from "../components/AwesomeModal";
import UserDetailsButton from "../components/profileScreen/UserDetailsButton";
import Profile from "../components/Profile";

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
const style = StyleSheet.create({
  text: {
    fontSize: 20,
    color: appStyle.color_primary,
  },
  socialButton: {
    flexGrow: 1,
    backgroundColor: appStyle.color_primary,
    padding: 8,
    borderRadius: 5,
  },
  leftText: {
    fontSize: 20,
    color: appStyle.color_on_primary,
  },
  rightText: {
    fontSize: 20,
    color: appStyle.color_primary,
  },
  leftSocialButton: {
    flexGrow: 1,
    backgroundColor: appStyle.color_primary,
    padding: 8,
    borderLeftRadius: 5,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  rightSocialButton: {
    flexGrow: 1,
    backgroundColor: appStyle.color_primary,
    padding: 8,
    borderRightRadius: 5,
    backgroundColor: appStyle.color_background,
    borderColor: appStyle.color_primary,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
});
export default ProfileScreen;
