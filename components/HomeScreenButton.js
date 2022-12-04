import { TouchableOpacity, Text, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import useAuth from "../hooks/useAuth";
const HomeScreenButton = (props) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  return (
    <View>
      {props.spaceHolderButton ? (
        <View className={`items-center justify-center w-36 h-36`}></View>
      ) : (
        <TouchableOpacity
          className={`items-center justify-center rounded-lg w-36 h-36`}
          style={{ backgroundColor: props.style.backgroundColor }}
          onPress={() => navigation.push(props.navigateScreen, { user: user })}
        >
          <FontAwesomeIcon
            icon={props.icon}
            size={props.style.iconSize}
            color={props.style.color}
          />
          <Text
            style={{ color: props.style.color }}
            className="font-bold text-center text-2xl"
          >
            {props.buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HomeScreenButton;
