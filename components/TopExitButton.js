import { View, Text } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft, faX } from "@fortawesome/free-solid-svg-icons";
import { color_on_background } from "../utils/appStyleSheet";

const TopExitButton = ({ icon }) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}
    >
      <TouchableOpacity onPress={navigation.goBack}>
        <FontAwesomeIcon
          icon={icon == "<" ? faChevronLeft : faX}
          size={30}
          color={color_on_background}
        />
      </TouchableOpacity>
    </View>
  );
};

export default TopExitButton;
