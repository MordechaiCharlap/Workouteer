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
import CustomText from "../components/basic/CustomText";
import CustomButton from "../components/basic/CustomButton";

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
  const buttonStyle = {
    color: appStyle.color_on_primary,
    backgroundColor: appStyle.color_primary,
    paddingHorizontal: 15,
    borderRadius: 999,
    flexDirection: "row",
  };
  return (
    <View style={safeAreaStyle()}>
      <ScrollView
        showsVerticalScrollIndicator={Platform.OS == "web" ? false : true}
      >
        <View
          style={{
            rowGap: 16,
          }}
        >
          <View
            className="flex-row items-center justify-between"
            style={{
              paddingHorizontal: 16,
            }}
          >
            <CustomButton onPress={() => navigation.navigate("EditData")}>
              <FontAwesomeIcon
                icon={faUserPen}
                size={30}
                color={appStyle.color_on_background}
              />
            </CustomButton>

            <CustomButton
              onPress={() =>
                navigation.navigate("Settings", { language: user.language })
              }
            >
              <FontAwesomeIcon
                icon={faGear}
                size={30}
                color={appStyle.color_on_background}
              />
            </CustomButton>
          </View>

          <View
            style={{
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{
                borderRadius: 20,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Image
                  source={{
                    uri: user.img,
                  }}
                  className=" bg-white rounded-full"
                  style={{
                    height: 120,
                    aspectRatio: 1 / 1,
                    borderWidth: 1,
                    borderColor: appStyle.color_outline,
                  }}
                />
              </View>
              <View
                style={{
                  alignItems: "flex-end",
                }}
              >
                <View className="flex-row items-center">
                  {Object.keys(user.plannedWorkouts).length > 0 && (
                    <UserDetailsButton
                      buttonStyle={buttonStyle}
                      color={buttonStyle.color}
                      iconColor={buttonStyle.color}
                      onPress={() => navigation.navigate("FutureWorkouts")}
                      text={Object.keys(user.plannedWorkouts).length}
                      icon={faClock}
                      smallIcon={faExclamationCircle}
                      specialButton={true}
                    />
                  )}

                  <View style={{ width: 20 }}></View>
                  <UserDetailsButton
                    buttonStyle={buttonStyle}
                    color={buttonStyle.color}
                    iconColor={buttonStyle.color}
                    onPress={() => navigation.navigate("PastWorkouts")}
                    text={user.workoutsCount}
                    icon={faDumbbell}
                    smallIcon={faCircleCheck}
                  />
                </View>
                <View style={{ height: 20 }}></View>
                <CustomButton
                  style={buttonStyle}
                  onPress={() =>
                    navigation.navigate("Friends", {
                      user: user,
                      isMyUser: true,
                    })
                  }
                >
                  <CustomText
                    style={{ fontSize: 25, color: buttonStyle.color }}
                  >
                    {user.friendsCount}
                  </CustomText>
                  <View style={{ width: 10 }}></View>
                  <FontAwesomeIcon
                    icon={faUserGroup}
                    size={30}
                    color={buttonStyle.color}
                  />
                  {user.friendRequestsCount > 0 ? (
                    <View className="absolute right-0 bottom-0">
                      <AlertDot
                        text={user.friendRequestsCount}
                        color={buttonStyle.backgroundColor}
                        borderColor={appStyle.color_surface}
                        textColor={buttonStyle.color}
                        borderWidth={1}
                        fontSize={13}
                        size={23}
                      />
                    </View>
                  ) : (
                    <></>
                  )}
                </CustomButton>
              </View>
            </View>
          </View>
          <View
            style={{
              backgroundColor: appStyle.color_surface,
              rowGap: 16,
              paddingHorizontal: 16,
              borderTopColor: appStyle.color_outline,
              borderTopWidth: 0.8,
            }}
          >
            <View>
              <CustomText
                style={{
                  fontSize: 16,
                  color: appStyle.color_on_surface,
                }}
              >
                #{user.id}
              </CustomText>
              <NameAndAge
                name={user.displayName}
                age={calculateAge()}
                color={appStyle.color_on_surface}
              />
            </View>
            <View>
              <UserStats
                shownUser={user}
                color={appStyle.color_on_primary_container}
                backgroundColor={appStyle.color_primary_container}
              />
            </View>
            <View
              className="rounded-xl p-4"
              style={{ backgroundColor: appStyle.color_primary_container }}
            >
              <CustomText
                style={{ color: appStyle.color_on_primary_container }}
                className="text-lg"
              >
                {user.description == ""
                  ? languageService[user.language].noDescriptionYet
                  : user.description}
              </CustomText>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default MyUserScreen;
