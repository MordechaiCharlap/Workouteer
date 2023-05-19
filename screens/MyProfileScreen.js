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

const MyProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();
  const {
    sendPushNotificationUserWantsToBeYourFriend,
    sendPushNotificationUserAcceptedYourFriendRequest,
  } = usePushNotifications();
  const [showReportModal, setShowReportModal] = useState(false);
  const { user } = useAuth();
  const isMyUser = !route?.params?.shownUser;
  const [futureWorkoutsCount, setFutureWorkoutsCount] = useState(
    isMyUser ? Object.keys(user.plannedWorkouts).length : 0
  );
  const shownUser = route?.params?.shownUser ? route?.params?.shownUser : user;
  const [friendshipStatus, setFriendshipStatus] = useState(
    route?.params?.friendshipStatus
  );
  const { setScreen } = useNavbarNavigation();
  const { friendRequestsAlerts, setFriendRequestsAlerts } = useAlerts();
  const calculateAge = () => {
    const dateToCheck = shownUser.birthdate.toDate();
    var today = new Date();
    var age = today.getFullYear() - dateToCheck.getFullYear();
    var m = today.getMonth() - dateToCheck.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dateToCheck.getDate())) {
      age--;
    }
    return age;
  };
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
      <View
        className="flex-row items-center justify-between"
        style={{
          paddingHorizontal: 16,
        }}
      >
        <CustomButton onPress={() => navigation.navigate("EditData")}>
          <FontAwesomeIcon
            icon={faUserPen}
            size={30}
            color={appStyle.color_on_background}
          />
        </CustomButton>

        <CustomButton
          onPress={() =>
            navigation.navigate("Settings", { language: user.language })
          }
        >
          <FontAwesomeIcon
            icon={faGear}
            size={30}
            color={appStyle.color_on_background}
          />
        </CustomButton>
      </View>
      <Profile isMyUser={true} shownUser={user} />
    </View>
  );
};
export default MyProfileScreen;
