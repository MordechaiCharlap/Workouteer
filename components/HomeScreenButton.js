import { TouchableOpacity, Text, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import React from "react";

const HomeScreenButton = (props) => {
  const navigation = useNavigation();
  const width = props.style.buttonSize;
  //Somehow this line above make the button not be wierd na flat
  return (
    <View>
      {props.spaceHolderButton ? (
        <View
          className={`items-center justify-center w-${props.style.buttonSize} h-${props.style.buttonSize} m-3`}
        ></View>
      ) : (
        <TouchableOpacity
          className={`items-center justify-center rounded-lg w-${props.style.buttonSize} h-${props.style.buttonSize} m-3`}
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
