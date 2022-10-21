import {
  Image,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { React, useContext, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import ResponsiveStyling from "../components/ResponsiveStyling";
import authContext from "../context/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../components/AppStyleSheet";
const MyUserScreen = () => {
  const { user } = useContext(authContext);
  const calculateAge = () => {
    const birthdate = user.birthdate.toDate();
    var today = new Date();
    var age = today.getFullYear() - birthdate.getFullYear();
    var m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    console.log(age);
    return age;
  };

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1">
        <View className="p-3">
          <View className="flex-row-reverse">
            <TouchableOpacity>
              <FontAwesomeIcon icon={faPencil} size={25} />
            </TouchableOpacity>
          </View>
          <Image
            source={{
              uri: "https://i.pinimg.com/564x/39/44/28/394428dcf049dbc614b3a34cef24c164.jpg",
            }}
            className="h-60 w-60 bg-white rounded-full mb-2 self-center"
          />
          <Text
            className="font-semibold text-5xl self-center"
            style={{
              color: appStyle.appGray,
            }}
          >
            {user.username}
          </Text>
          <Text
            className="self-center font-bold text-2xl tracking-wider"
            style={{ color: appStyle.appGray }}
          >
            {user.firstName} {user.lastName}, {calculateAge()}
          </Text>
        </View>
        <View
          className="rounded-t-3xl flex-1 mx-2"
          style={{ backgroundColor: appStyle.appGray }}
        >
          <View
            className="flex-row justify-around"
            style={style.workoutAndFriends}
          >
            <View className="items-center">
              <Text style={style.text} className="font-bold">
                {user.workoutsCount}
              </Text>
              <Text style={style.text}>Workouts</Text>
            </View>
            <View className="items-center">
              <Text style={style.text} className="font-bold">
                {user.friendsCount}
              </Text>
              <Text style={style.text}>Friends</Text>
            </View>
          </View>
        </View>
      </View>
      <BottomNavbar currentScreen="MyUser" />
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  text: {
    fontSize: 20,
    color: appStyle.appDarkBlue,
  },
  workoutAndFriends: {
    borderBottomColor: appStyle.appAzure,
    borderBottomWidth: 1,
  },
});
export default MyUserScreen;
