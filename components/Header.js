import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { appDarkBlue, appGray } from "./AppStyleSheet";
import { useNavigation } from "@react-navigation/native";
const Header = (props) => {
  const navigation = useNavigation();
  return (
    <View
      className="flex-row items-center pt-5 px-5 justify-between"
      style={{ backgroundColor: appDarkBlue }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesomeIcon
          icon={faChevronLeft}
          size={40}
          color={props.color ? color : appGray}
        />
      </TouchableOpacity>

      <Text className="text-4xl font-semibold" style={{ color: appGray }}>
        {props.title}
      </Text>
      <FontAwesomeIcon icon={faChevronLeft} size={40} color={appDarkBlue} />
    </View>
  );
};

export default Header;
