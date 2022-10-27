import {
  Image,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { React, useEffect, useContext, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import ResponsiveStyling from "../components/ResponsiveStyling";
import authContext from "../context/authContext";
import * as firebase from "../services/firebase";
import * as appStyle from "../components/AppStyleSheet";
const MyUserScreen = () => {
  const { user } = useContext(authContext);
  const allFriendsMap = new Map(Object.entries(user.friends));
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {}, []);

  // const ChangePreferences = () => {
  //   console.log("moving to preferences");
  //   navigation.navigate("ChangePreferences");
  // };
  // const calculateAge = () => {
  //   const birthdate = user.birthdate.toDate();
  //   var today = new Date();
  //   var age = today.getFullYear() - birthdate.getFullYear();
  //   var m = today.getMonth() - birthdate.getMonth();
  //   if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
  //     age--;
  //   }
  //   console.log(age);
  //   return age;
  // };
  const showFriends = async () => {
    const friendsArr = [];
    for (var key of allFriendsMap.keys()) {
      var userData = await firebase.userDataById(key);
      console.log(userData);
      friendsArr.push({
        id: key,
        username: userData.username,
        displayName: userData.displayName,
        img: userData.img,
      });
      console.log(friendsArr);
      setShownFriendsArray(friendsArr);
    }
    navigation.navigate("Friends", { friendsArray: friendsArr });
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1">
        <ScrollView>
          <View className="p-4">
            <Text
              className=" text-center text-3xl tracking-widest"
              style={{ color: appStyle.appGray }}
            >
              {user.username}
            </Text>
            <View className="flex-row mt-6 mb-3">
              <Image
                source={{
                  uri: user.img,
                }}
                className="h-32 w-32 bg-white rounded-full mb-2 self-center"
              />
              <View className="flex-row flex-1 justify-around">
                <View>
                  <TouchableOpacity className="items-center">
                    <Text
                      style={{ fontSize: 20, color: appStyle.appGray }}
                      className="font-bold"
                    >
                      {user.workoutsCount}
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
                    <Text style={{ fontSize: 20, color: appStyle.appGray }}>
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
              className="font-semibold text-2xl"
              style={{
                color: appStyle.appGray,
              }}
            >
              {user.displayName}
            </Text>
            <Text style={{ color: appStyle.appGray }} className="text-lg">
              No description yet.
            </Text>
          </View>
        </ScrollView>
      </View>
      <BottomNavbar currentScreen="MyUser" />
    </SafeAreaView>
  );
};
export default MyUserScreen;
