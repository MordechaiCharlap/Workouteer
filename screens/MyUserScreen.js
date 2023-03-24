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
import UserStats from "../components/profileScreen/UserStats";
import NameAndAge from "../components/profileScreen/NameAndAge";
import languageService from "../services/languageService";
import useNavbarDisplay from "../hooks/useNavbarDisplay";

const MyUserScreen = () => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();

  const { user } = useAuth();
  const { setScreen } = useNavbarNavigation();
  const { friendRequestsAlerts, setFriendRequestsAlerts } = useAlerts();

  const [workoutsCount, setWorkoutsCount] = useState();
  useEffect(() => {
    var count = 0;
    for (var value of Object.values(user.workouts)) {
      if (value[2]) count++;
    }
    setWorkoutsCount(count);
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
      setCurrentScreen("MyUser");
      setScreen("MyUser");

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
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View className="flex-1">
        <ScrollView>
          <View className="p-4 gap-y-4">
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

            <View className="flex-row h-48 items-center">
              <Image
                source={{
                  uri: user.img,
                }}
                className="h-32 w-32 bg-white rounded-full"
                style={{ borderWidth: 1, borderColor: appStyle.color_primary }}
              />

              <View className="absolute right-0 gap-y-3">
                <TouchableOpacity
                  className="items-center flex-row rounded-2xl p-3 gap-x-3"
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
                  className="items-center flex-row rounded-2xl p-3 gap-x-3"
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
                        color={appStyle.color_on_primary}
                        borderColor={appStyle.color_primary}
                        textColor={appStyle.color_primary}
                        borderWidth={1.5}
                        fontSize={10}
                        size={23}
                      />
                    </View>
                  ) : (
                    <></>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <NameAndAge
                name={user.displayName}
                age={calculateAge(user.birthdate.toDate())}
              />
            </View>
            <View>
              <UserStats shownUser={user} />
            </View>
            <View
              className="rounded-xl p-4"
              style={{ backgroundColor: appStyle.color_primary }}
            >
              <Text
                style={{ color: appStyle.color_on_primary }}
                className="text-lg"
              >
                {user.description == ""
                  ? languageService[user.language].noDescriptionYet
                  : user.description}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
export default MyUserScreen;
