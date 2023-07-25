import { View, Text, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft, faX } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import * as appStyle from "../utils/appStyleSheet";
const Header = (props) => {
  const navigation = useNavigation();
  return (
    <View
      className="flex-row items-center"
      style={{
        paddingVertical: 16,
        paddingHorizontal: 16,
        justifyContent: props.goBackOption ? "space-between" : "center",
      }}
    >
      {props.goBackOption && (
        <TouchableOpacity onPress={props.navigate || navigation.goBack}>
          <FontAwesomeIcon
            icon={props.icon == "<" ? faChevronLeft : faX}
            size={30}
            color={props.color || appStyle.color_on_background}
          />
        </TouchableOpacity>
      )}

      <Text
        className="text-2xl font-semibold"
        style={{ color: appStyle.color_on_background }}
      >
        {props.title}
      </Text>
      {props.goBackOption && (
        <FontAwesomeIcon
          icon={faChevronLeft}
          size={40}
          color={appStyle.color_background}
        />
      )}
      {props.children}
    </View>
  );
};

export default Header;
