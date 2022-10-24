import {
  Image,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { React, useEffect, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import ResponsiveStyling from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
const UserScreen = ({ route }) => {
  const shownUser = route.params.shownUser;
  useEffect(() => {
    console.log(shownUser);
  });
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const sendFriendRequest = () => {
    //TODO
  };
  const calculateAge = () => {
    const birthdate = shownUser.birthdate.toDate();
    var today = new Date();
    var age = today.getFullYear() - birthdate.getFullYear();
    var m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    console.log(age);
    return age;
  };
  const renderSocialButtons = () => {
    if (shownUser.isPublic == false) {
      return (
        <View className="flex-row items-center self-center">
          <TouchableOpacity
            onPress={sendFriendRequest}
            style={style.socialButton}
          >
            <Text
              className="text-center text-xl"
              style={{ color: appStyle.appGray }}
            >
              Add as a friend
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else if (shownUser.isPublic == true) {
      return (
        <View className="flex-row items-center self-center">
          <TouchableOpacity
            onPress={sendFriendRequest}
            style={style.socialButton}
          >
            <Text
              className="text-center text-xl"
              style={{ color: appStyle.appGray }}
            >
              Add as a friend
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={sendFriendRequest}
            style={style.socialButton}
          >
            <Text
              className="text-center text-xl"
              style={{ color: appStyle.appGray }}
            >
              Send a message
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1 p-3">
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={30}
              color={appStyle.appGray}
            />
          </TouchableOpacity>
        </View>
        <Image
          source={{
            uri: shownUser.img,
          }}
          className="h-60 w-60 bg-white rounded-full mb-2 self-center"
        />
        <Text
          className="font-semibold text-4xl self-center"
          style={{
            color: appStyle.appGray,
          }}
        >
          {shownUser.username}
        </Text>
        <Text
          className="self-center font-bold text-xl tracking-wider"
          style={{ color: appStyle.appGray }}
        >
          {shownUser.firstName} {shownUser.lastName}, {calculateAge()}
        </Text>

        <View
          className="flex-row justify-around"
          style={style.workoutAndFriends}
        >
          <View className="items-center">
            <Text style={style.text} className="font-bold">
              {shownUser.workoutsCount}
            </Text>
            <Text style={style.text}>Workouts</Text>
          </View>
          <View className="items-center">
            <Text style={style.text} className="font-bold">
              {shownUser.friendsCount}
            </Text>
            <Text style={style.text}>Friends</Text>
          </View>
        </View>
        {renderSocialButtons()}
      </View>
      <BottomNavbar currentScreen="User" />
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  text: {
    fontSize: 20,
    color: appStyle.appGray,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: appStyle.appGray,
    padding: 4,
    margin: 10,
    borderRadius: 5,
  },
});
export default UserScreen;
