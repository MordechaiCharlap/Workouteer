import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { React, useLayoutEffect, useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import responsiveStyle from "../components/ResponsiveStyling";
import * as firebase from "../services/firebase";
import * as appStyle from "../components/AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUserPen,
  faGear,
  faDumbbell,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
import useAlerts from "../hooks/useAlerts";
import AlertDot from "../components/AlertDot";
const MyUserScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { setScreen } = useNavbarNavigation();
  const { friendRequestsAlerts, setFriendRequestsAlerts } = useAlerts();

  const [workoutsCount, setWorkoutsCount] = useState();
  useEffect(() => {
    const now = new Date();
    var count = 0;
    for (var value of Object.values(user.workouts)) {
      if (value.toDate() < now) count++;
    }
    setWorkoutsCount(count);
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const calculateAge = (dateToCheck) => {
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
      const cleanFriendRequestsAlerts = async () => {
        await firebase.removeAllFriendRequestAlerts(user.id);
      };
      if (Object.keys(friendRequestsAlerts).length > 0) {
        setFriendRequestsAlerts({});
        cleanFriendRequestsAlerts();
      }
      setScreen("MyUser");
    }, [])
  );
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View className="flex-1">
        <ScrollView>
          <View className="p-4">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={() => navigation.navigate("EditData")}>
                <FontAwesomeIcon
                  icon={faUserPen}
                  size={25}
                  color={appStyle.color_primary}
                />
              </TouchableOpacity>

              <Text
                className="text-3xl tracking-widest"
                style={{ color: appStyle.color_primary }}
              >
                {user.id}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <FontAwesomeIcon
                  icon={faGear}
                  size={25}
                  color={appStyle.color_primary}
                />
              </TouchableOpacity>
            </View>

            <View className="flex-row mt-6 mb-3 h-48 items-center">
              <Image
                source={{
                  uri: user.img,
                }}
                className="h-32 w-32 bg-white rounded-full mb-2"
                style={{ borderWidth: 1, borderColor: appStyle.color_primary }}
              />

              <View className="absolute right-0 gap-3">
                <TouchableOpacity
                  className="items-center flex-row rounded-2xl p-3 gap-3"
                  style={{ backgroundColor: appStyle.color_primary }}
                  onPress={() =>
                    navigation.navigate("PastWorkouts", { user: user })
                  }
                >
                  <Text
                    style={{ fontSize: 30, color: appStyle.color_on_primary }}
                  >
                    {workoutsCount}
                  </Text>
                  <FontAwesomeIcon
                    icon={faDumbbell}
                    size={40}
                    color={appStyle.color_on_primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  className="items-center flex-row rounded-2xl p-3 gap-3"
                  style={{ backgroundColor: appStyle.color_primary }}
                  onPress={() =>
                    navigation.navigate("Friends", {
                      user: user,
                      isMyUser: true,
                    })
                  }
                >
                  <Text
                    style={{ fontSize: 30, color: appStyle.color_on_primary }}
                  >
                    {user.friendsCount}
                  </Text>
                  <FontAwesomeIcon
                    icon={faUserGroup}
                    size={40}
                    color={appStyle.color_on_primary}
                  />
                  {user.friendRequestsCount > 0 ? (
                    <View className="absolute left-0 bottom-0">
                      <AlertDot
                        text={user.friendRequestsCount}
                        textColor={appStyle.color_primary}
                        color={appStyle.color_bg}
                        size={20}
                      />
                    </View>
                  ) : (
                    <></>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-row">
              <Text
                className="px-4 py-2 rounded-xl text-3xl"
                style={{
                  color: appStyle.color_on_primary,
                  backgroundColor: appStyle.color_primary,
                }}
              >
                {user.displayName}, {calculateAge(user.birthdate.toDate())}
              </Text>
            </View>
            <View
              className="rounded-xl p-4 mt-2"
              style={{ backgroundColor: appStyle.color_primary }}
            >
              <Text
                style={{ color: appStyle.color_on_primary }}
                className="text-lg"
              >
                {user.description == ""
                  ? "No description yet"
                  : user.description}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
      <BottomNavbar currentScreen="MyUser" />
    </View>
  );
};
export default MyUserScreen;
