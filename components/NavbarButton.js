import React from "react";
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
      onPress={props.screen != props.currentScreen ? navigate : {}}
      style={
        props.screen != props.currentScreen ? style.button : style.currentButton
      }
    >
      <FontAwesomeIcon
        icon={getIcon()}
        size={props.screen == "Home" ? 40 : 30}
        color={props.screen == "Home" ? "#c60f1a" : appStyle.appDarkBlue}
      />
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
