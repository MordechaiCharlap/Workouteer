import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import * as appStyle from "./AppStyleSheet";
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
            color={props.color ? color : appGray}
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}

      <Text className="text-4xl font-semibold" style={{ color: appGray }}>
        {props.title}
      </Text>
      {props.goBackOption ? (
        <FontAwesomeIcon icon={faChevronLeft} size={40} color={appDarkBlue} />
      ) : (
        <></>
      )}
    </View>
  );
};

export default Header;
