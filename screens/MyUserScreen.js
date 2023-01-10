import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { React, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
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
const MyUserScreen = () => {
  const { user } = useAuth();
  const allFriendsMap = new Map(Object.entries(user.friends));
  const [workoutsCount, setWorkoutsCount] = useState();
  useEffect(() => {
    const workouts = new Map(Object.entries(user.workouts));
    const now = new Date();
    var count = 0;
    for (var value of workouts.values()) {
      if (value.toDate() < now) count++;
    }
    setWorkoutsCount(count);
  }, []);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
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
                {user.username}
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

              <View className="absolute right-4 gap-3">
                <TouchableOpacity
                  className="items-center flex-row rounded-2xl p-3 gap-3"
                  style={{ backgroundColor: appStyle.color_primary }}
                  onPress={() =>
                    navigation.navigate("PastWorkouts", { user: user })
                  }
                >
                  <Text
                    style={{ fontSize: 20, color: appStyle.color_on_primary }}
                    className="font-bold"
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
                  onPress={() => navigation.navigate("Friends")}
                >
                  <Text
                    style={{ fontSize: 20, color: appStyle.color_on_primary }}
                    className="font-bold"
                  >
                    {user.friendsCount}
                  </Text>
                  <FontAwesomeIcon
                    icon={faUserGroup}
                    size={40}
                    color={appStyle.color_on_primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text
              className="font-semibold text-2xl mb-5"
              style={{
                color: appStyle.color_primary,
              }}
            >
              {user.displayName}
            </Text>
            <Text style={{ color: appStyle.color_primary }} className="text-lg">
              {user.description == "" ? "No description yet" : user.description}
            </Text>
          </View>
        </ScrollView>
      </View>
      <BottomNavbar currentScreen="MyUser" />
    </View>
  );
};
export default MyUserScreen;
