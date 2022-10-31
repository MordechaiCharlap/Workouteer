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
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import BottomNavbar from "../components/BottomNavbar";
import ResponsiveStyling from "../components/ResponsiveStyling";
import authContext from "../context/authContext";
import * as firebase from "../services/firebase";
import * as appStyle from "../components/AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPen, faGear, faSliders } from "@fortawesome/free-solid-svg-icons";
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
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1">
        <ScrollView>
          <View className="p-4">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity>
                <FontAwesomeIcon
                  icon={faSliders}
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
              <TouchableOpacity>
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
                <TouchableOpacity
                  className="absolute right-0 bottom-0 rounded-full p-2"
                  style={{
                    backgroundColor: appStyle.appGray,
                    borderWidth: 1,
                    borderColor: appStyle.appDarkBlue,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPen}
                    size={20}
                    color={appStyle.appDarkBlue}
                  />
                </TouchableOpacity>
              </View>

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
