import React, { useEffect } from "react";
import { TouchableOpacity, StyleSheet, Text, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as appStyle from "../utilities/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCircleUser,
  faDumbbell,
  faComments,
  faGlobe,
  faRankingStar,
} from "@fortawesome/free-solid-svg-icons";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import useAuth from "../hooks/useAuth";
import AlertDot from "./AlertDot";
const renderAlert = () => {
  return (
    <View className="absolute left-0 bottom-0">
      <AlertDot
        size={17}
        color={appStyle.color_error}
        borderColor={appStyle.color_background}
        borderWidth={2}
      />
    </View>
  );
};
const NavbarButton = (props) => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { currentScreen } = useNavbarDisplay();
  const getIcon = () => {
    const icons = {
      MyUser: faCircleUser,
      Leaderboard: faRankingStar,
      Home: faDumbbell,
      Chats: faComments,
      Explore: faGlobe,
    };
    return icons[props.screen];
  };

  return (
    <TouchableOpacity
      className="flex-grow w-1 items-center justify-center"
      onPress={() => {
        navigation.navigate(props.screen);
      }}
    >
      {props.screen == "Home" && (
        <View className="absolute h-full w-full items-center justify-center">
          <FontAwesomeIcon
            icon={getIcon()}
            size={50}
            color={appStyle.color_primary}
          />
        </View>
      )}
      {props.screen == "MyProfile" ? (
        <View>
          <Image
            source={{
              uri: user?.img,
            }}
            className="bg-white rounded-full"
            style={[
              {
                height: 38,
                width: 38,
              },
              props.screen == currentScreen && {
                borderColor: appStyle.color_on_background,
                borderWidth: 1,
              },
            ]}
          />
          {props.alert == true && renderAlert()}
        </View>
      ) : (
        <View>
          <FontAwesomeIcon
            icon={getIcon()}
            size={props.screen == "Home" ? 45 : 30}
            color={
              props.screen == currentScreen
                ? appStyle.color_on_background
                : appStyle.color_on_surface_variant
            }
          />
          {props.alert == true && renderAlert()}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default NavbarButton;
