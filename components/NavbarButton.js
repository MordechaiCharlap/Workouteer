import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as appStyle from "../components/AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCircleUser,
  faCalendarDays,
  faCirclePlus,
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
    if (props.screen == "Home") return faCirclePlus;
    if (props.screen == "Chats") return faComments;
    if (props.screen == "Explore") return faGlobe;
  };
  const navigation = useNavigation();
  const navigate = async () => {
    setUser(await firebase.updateContext(user.usernameLower));
    navigation.navigate(props.screen);
  };
  if (props.screen != props.currentScreen) {
    return (
      <TouchableOpacity
        className="flex-grow w-1 items-center justify-center"
        onPress={navigate}
        style={style.button}
      >
        <FontAwesomeIcon
          icon={getIcon()}
          size={30}
          color={appStyle.appDarkBlue}
        />
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        className="flex-grow w-1 items-center justify-center"
        style={style.currentButton}
      >
        <FontAwesomeIcon
          icon={getIcon()}
          size={30}
          color={appStyle.appDarkBlue}
        />
      </TouchableOpacity>
    );
  }
};
const style = StyleSheet.create({
  button: {},
  currentButton: {
    backgroundColor: appStyle.appAzure, // invisible color
  },
});

export default NavbarButton;
