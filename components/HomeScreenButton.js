import { TouchableOpacity, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import React from "react";

const HomeScreenButton = (props) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      className={`items-center justify-center rounded-lg shadow-lg w-${props.buttonSize} h-${props.buttonSize}`}
      style={{ backgroundColor: props.backgroundColor }}
      onPress={() => navigation.navigate("NewWorkout")}
    >
      <FontAwesomeIcon
        icon={props.icon}
        size={props.iconSize}
        color={props.color}
      />
      <Text
        style={{ color: props.color }}
        className="font-bold text-center text-3xl"
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

export default HomeScreenButton;
