import React, { useEffect } from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as appStyle from "../components/AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCircleUser,
  faCalendarDays,
  faDumbbell,
  faComments,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
const NavbarButton = (props) => {
  const { user, setUser } = useAuth();
  const getIcon = () => {
    if (props.screen == "MyUser") return faCircleUser;
    if (props.screen == "Calendar") return faCalendarDays;
    if (props.screen == "Home") return faDumbbell;
    if (props.screen == "Chats") return faComments;
    if (props.screen == "Explore") return faGlobe;
  };
  const navigation = useNavigation();
  const navigate = async () => {
    setUser(await firebase.updateContext(user.usernameLower));
    navigation.navigate(props.screen);
  };
  return (
    <TouchableOpacity
      className="flex-grow w-1 items-center justify-center"
      onPress={() => (props.screen != props.currentScreen ? navigate() : {})}
      style={
        props.screen != props.currentScreen ? style.button : style.currentButton
      }
    >
      {props.screen == "Home" && (
        <View className="absolute h-max w-max items-center justify-center">
          <FontAwesomeIcon icon={getIcon()} size={50} color={appStyle.appRed} />
        </View>
      )}

      <View>
        <FontAwesomeIcon
          icon={getIcon()}
          size={props.screen == "Home" ? 45 : 30}
          color={appStyle.appDarkBlue}
        />

        {props.alert != null && props.alert == true && (
          <View
            className="absolute bg-white w-4 h-4 left-0 bottom-0 rounded-full justify-center items-center"
            style={{
              backgroundColor: appStyle.appRed,
              borderColor: appStyle.appDarkBlue,
              borderWidth: 2,
            }}
          ></View>
        )}
      </View>
    </TouchableOpacity>
  );
};
const style = StyleSheet.create({
  button: {},
  currentButton: {
    backgroundColor: appStyle.appAzure, // invisible color
  },
});

export default NavbarButton;
