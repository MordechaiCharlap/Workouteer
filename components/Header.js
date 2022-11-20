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
      className="flex-row items-center py-4 px-5"
      style={{
        backgroundColor: appDarkBlue,
        justifyContent: props.goBackOption ? "space-between" : "center",
      }}
    >
      {props.goBackOption ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
