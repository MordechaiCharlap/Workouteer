import { View, Text, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import * as appStyle from "../utilities/appStyleSheet";
const Header = (props) => {
  const navigation = useNavigation();
  return (
    <View
      className="flex-row items-center h-10 mt-4 mb-2"
      style={{
        backgroundColor: appStyle.color_bg,
        justifyContent: props.goBackOption ? "space-between" : "center",
      }}
    >
      {props.goBackOption ? (
        <TouchableOpacity
          onPress={props.navigate ? props.navigate : () => navigation.goBack()}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={40}
            color={props.color ? props.color : appStyle.color_primary}
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}

      <Text
        className={
          Platform.OS == "web"
            ? "text-2xl font-semibold"
            : "text-4xl font-semibold"
        }
        style={{ color: appStyle.color_primary }}
      >
        {props.title}
      </Text>
      {props.goBackOption ? (
        <FontAwesomeIcon
          icon={faChevronLeft}
          size={40}
          color={appStyle.color_bg}
        />
      ) : (
        <></>
      )}
    </View>
  );
};

export default Header;
