import { TouchableOpacity, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import React from "react";

const HomeScreenButton = (props) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      className={`items-center justify-center rounded-lg shadow-lg w-${props.style.buttonSize} h-${props.style.buttonSize}`}
      style={{ backgroundColor: props.style.backgroundColor }}
      onPress={() => navigation.navigate(props.navigateScreen)}
    >
      <FontAwesomeIcon
        icon={props.icon}
        size={props.style.iconSize}
        color={props.style.color}
      />
      <Text
        style={{ color: props.style.color }}
        className="font-bold text-center text-3xl"
      >
        {props.buttonText}
      </Text>
    </TouchableOpacity>
  );
};

export default HomeScreenButton;
