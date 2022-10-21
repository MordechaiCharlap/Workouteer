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
const NavbarButton = (props) => {
  const getIcon = () => {
    if (props.screen == "MyUser") return faCircleUser;
    if (props.screen == "Calendar") return faCalendarDays;
    if (props.screen == "Home") return faCirclePlus;
    if (props.screen == "Chats") return faComments;
    if (props.screen == "Explore") return faGlobe;
  };
  const navigation = useNavigation();
  if (props.screen != props.currentScreen) {
    return (
      <TouchableOpacity
        className="flex-grow w-1 items-center justify-center"
        onPress={() => navigation.navigate(props.screen)}
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
        style={{ backgroundColor: appStyle.appAzure }}
      >
        <FontAwesomeIcon
          icon={getIcon()}
          size={30}
          color={appStyle.appDarkBlue}
        />
      </TouchableOpacity>
    );
  }
  //   return (
  //     <TouchableOpacity
  //       onPress={() => navigation.navigate(props.screen)}
  //       style={styles.button}
  //     >
  //       <Text style={styles.buttonText}>{props.screen}</Text>
  //     </TouchableOpacity>
  //   );
  // } else {
  //   return (
  //     <TouchableOpacity style={styles.button}>
  //       <Text style={styles.selectedButtonText}>{props.screen}</Text>
  //       <View
  //         className="mt-1 pt-1 h-1"
  //         style={{
  //           backgroundColor: appStyle.appDarkBlue,
  //           width: "100%",
  //         }}
  //       />
  //     </TouchableOpacity>
  //   );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: appStyle.appLightBlue,
    alignItems: "center",
    padding: 15,
    flex: 1,
  },
  buttonText: {
    color: appStyle.appDarkBlue,
    // fontWeight: 400,
  },
  selectedButtonText: {
    // fontWeight: 500,
    color: appStyle.appDarkBlue,
  },
});

export default NavbarButton;
