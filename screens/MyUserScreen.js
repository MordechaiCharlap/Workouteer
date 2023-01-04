import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { React, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import responsiveStyle from "../components/ResponsiveStyling";
import * as firebase from "../services/firebase";
import * as appStyle from "../components/AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserPen, faGear, faPen } from "@fortawesome/free-solid-svg-icons";
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
  const showFriends = async () => {
    const friendsArr = [];
    for (var key of allFriendsMap.keys()) {
      var userData = await firebase.userDataById(key);
      console.log(userData);
      friendsArr.push(userData);
      console.log(friendsArr);
    }
    navigation.navigate("Friends", { friendsArray: friendsArr });
  };
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <View className="flex-1">
        <ScrollView>
          <View className="p-4">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={() => navigation.navigate("EditData")}>
                <FontAwesomeIcon
                  icon={faUserPen}
                  size={25}
                  color={appStyle.appGray}
                />
              </TouchableOpacity>

              <Text
                className="text-3xl tracking-widest"
                style={{ color: appStyle.appGray }}
              >
                {user.username}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <FontAwesomeIcon
                  icon={faGear}
                  size={25}
                  color={appStyle.appGray}
                />
              </TouchableOpacity>
            </View>

            <View className="flex-row mt-6 mb-3">
              <View>
                <Image
                  source={{
                    uri: user.img,
                  }}
                  className="h-32 w-32 bg-white rounded-full mb-2 self-center"
                />
              </View>

              <View className="flex-row flex-1 justify-around">
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("PastWorkouts", { user: user })
                    }
                    className="items-center"
                  >
                    <Text
                      style={{ fontSize: 20, color: appStyle.appGray }}
                      className="font-bold"
                    >
                      {workoutsCount}
                    </Text>
                    <Text style={{ fontSize: 20, color: appStyle.appGray }}>
                      Workouts
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    className="items-center"
                    onPress={showFriends}
                  >
                    <Text
                      style={{ fontSize: 20, color: appStyle.appGray }}
                      className="font-bold"
                    >
                      {user.friendsCount}
                    </Text>
                    <Text style={{ fontSize: 20, color: appStyle.appGray }}>
                      Friends
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Text
              className="font-semibold text-2xl mb-5"
              style={{
                color: appStyle.appGray,
              }}
            >
              {user.displayName}
            </Text>
            <Text style={{ color: appStyle.appGray }} className="text-lg">
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
