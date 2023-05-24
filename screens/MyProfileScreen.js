import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { React, useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as firebase from "../services/firebase";
import * as appStyle from "../utilities/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUserPen,
  faGear,
  faDumbbell,
  faUserGroup,
  faCircleCheck,
  faExclamationCircle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
import useAlerts from "../hooks/useAlerts";
import AlertDot from "../components/AlertDot";
import UserStats from "../components/profileScreen/UserStats";
import NameAndAge from "../components/profileScreen/NameAndAge";
import languageService from "../services/languageService";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { Platform } from "react-native";
import UserDetailsButton from "../components/profileScreen/UserDetailsButton";
import CustomText from "../components/basic/CustomText";
import CustomButton from "../components/basic/CustomButton";
import usePushNotifications from "../hooks/usePushNotifications";
import AwesomeModal from "../components/AwesomeModal";
import Profile from "../components/Profile";

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
