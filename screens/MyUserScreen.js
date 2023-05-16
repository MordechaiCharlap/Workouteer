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
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as firebase from "../services/firebase";
import * as appStyle from "../utilities/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUserPen,
  faGear,
  faDumbbell,
  faUserGroup,
  faCircleCheck,
  faExclamationCircle,
  faClock,
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
import { Platform } from "react-native";
import UserDetailsButton from "../components/profileScreen/UserDetailsButton";

const MyUserScreen = () => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();
  const { user } = useAuth();
  const { setScreen } = useNavbarNavigation();
  const { friendRequestsAlerts, setFriendRequestsAlerts } = useAlerts();
  const calculateAge = () => {
    const dateToCheck = user.birthdate.toDate();
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
    <View style={safeAreaStyle()}>
      <View className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={Platform.OS == "web" ? false : true}
        >
          <View className="p-4 gap-y-4">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={() => navigation.navigate("EditData")}>
                <FontAwesomeIcon
                  icon={faUserPen}
                  size={30}
                  color={appStyle.color_primary}
                />
              </TouchableOpacity>

              <Text
                className="text-3xl tracking-widest"
                style={{ color: appStyle.color_primary }}
              >
                {user.id}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Settings", { language: user.language })
                }
              >
                <FontAwesomeIcon
                  icon={faGear}
                  size={30}
                  color={appStyle.color_primary}
                />
              </TouchableOpacity>
            </View>

            <View className="flex-row h-48 justify-between">
              <View className="justify-center">
                <Image
                  source={{
                    uri: user.img,
                  }}
                  className="h-32 w-32 bg-white rounded-full"
                  style={{
                    borderWidth: 1,
                    borderColor: appStyle.color_primary,
                  }}
                />
              </View>
              <View
                style={{
                  justifyContent: "space-around",
                  alignItems: "flex-end",
                }}
              >
                <View className="flex-row items-center">
                  {Object.keys(user.plannedWorkouts).length > 0 && (
                    <UserDetailsButton
                      onPress={() => navigation.navigate("FutureWorkouts")}
                      text={Object.keys(user.plannedWorkouts).length}
                      icon={faClock}
                      smallIcon={faExclamationCircle}
                      specialButton={true}
                    />
                  )}
                  {/* <View
                    className="rounded-full"
                    style={{
                      backgroundColor: appStyle.color_on_primary,
                      padding: 3,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faClock}
                      color={appStyle.color_primary}
                      size={60}
                    />
                    <View
                      className="absolute rounded-full items-center justify-center right-0 bottom-0"
                      style={{
                        height: 30,
                        aspectRatio: 1,
                        backgroundColor: appStyle.color_primary,
                        borderWidth: 3,
                        borderColor: appStyle.color_on_primary,
                      }}
                    >
                      <Text style={{ color: appStyle.color_on_primary }}>
                        {Object.keys(user.plannedWorkouts).length}
                      </Text>
                    </View>
                  </View> */}
                  <View style={{ width: 10 }}></View>
                  <UserDetailsButton
                    onPress={() => navigation.navigate("PastWorkouts")}
                    text={user.workoutsCount}
                    icon={faDumbbell}
                    smallIcon={faCircleCheck}
                  />
                </View>
                <TouchableOpacity
                  className="items-center flex-row rounded-2xl p-3"
                  style={{
                    backgroundColor: appStyle.color_primary,
                  }}
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
                  <View style={{ width: 10 }}></View>
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
              <NameAndAge name={user.displayName} age={calculateAge()} />
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
