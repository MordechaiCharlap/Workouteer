import { SafeAreaView, View, TouchableOpacity, Text } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import style from "../components/ResponsiveStyling";
import HomeScreenButton from "../components/HomeScreenButton";
import * as appStyle from "../components/AppStyleSheet";
import {
  faClock,
  faPlus,
  faMagnifyingGlass,
  faUserGroup,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import useNotifications from "../hooks/useNotifications";
import useAuth from "../hooks/useAuth";
const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const { sendPushNotification } = useNotifications();
  const buttonStyle = {
    color: appStyle.appGray,
    backgroundColor: appStyle.appAzure,
    iconSize: 40,
  };
  return (
    <SafeAreaView style={style.safeAreaStyle}>
      <View className="flex-1 p-3">
        <View className="flex-row justify-around my-5">
          <HomeScreenButton
            buttonText="FIND A WORKOUT"
            style={buttonStyle}
            navigateScreen="FindWorkout"
            icon={faMagnifyingGlass}
          />
          <HomeScreenButton
            buttonText="CREATE WORKOUT"
            style={buttonStyle}
            navigateScreen="NewWorkout"
            icon={faPlus}
          />
        </View>
        <View className="flex-row justify-around my-5">
          <HomeScreenButton
            buttonText="FUTURE WORKOUTS"
            style={buttonStyle}
            navigateScreen="FutureWorkouts"
            icon={faClock}
          />
          <HomeScreenButton
            buttonText="PAST WORKOUTS"
            style={buttonStyle}
            navigateScreen="PastWorkouts"
            icon={faCalendarCheck}
          />
        </View>
        <View className="flex-row justify-around my-5">
          <HomeScreenButton
            buttonText="FRIENDS WORKOUTS"
            style={buttonStyle}
            navigateScreen="NewWorkout"
            icon={faUserGroup}
          />
          <HomeScreenButton style={buttonStyle} spaceHolderButton={true} />
        </View>
        <View className="my-5 flex-row justify-around">
          <TouchableOpacity
            onPress={async () =>
              await sendPushNotification(
                user,
                "I`m a title",
                "and I`m the body"
              )
            }
            className="p-2"
            style={{ backgroundColor: appStyle.appGray }}
          >
            <Text>Send Notofication</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomNavbar currentScreen="Home" />
    </SafeAreaView>
  );
};

export default HomeScreen;
