import {
  Image,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { React, useContext, useEffect, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import ResponsiveStyling from "../components/ResponsiveStyling";
import authContext from "../context/authContext";
import * as appStyle from "../components/AppStyleSheet";
const UserScreen = ({ route }) => {
  const { user } = useContext(authContext);
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

  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1">
        <ScrollView>
          <View className="p-3">
            <View className="flex-row justify-between">
              <TouchableOpacity>
                <Text style={{ color: appStyle.appGray }}> Go back</Text>
              </TouchableOpacity>
              <Text style={{ color: appStyle.appGray }}>Profile</Text>
              <TouchableOpacity>
                <Text style={{ color: appStyle.appGray }}>+</Text>
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
          </View>
          <View className="mx-2">
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
            <TouchableOpacity
              onPress={sendFriendRequest}
              className="w-fit"
              style={style.addFriendButton}
            >
              <Text>Add as a friend</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  addFriendButton: {
    borderWidth: 1,
    borderColor: appStyle.appLightBlue,
  },
});
export default UserScreen;
