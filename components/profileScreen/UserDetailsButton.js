import { TouchableOpacity, Text, View } from "react-native";
import React from "react";
import * as appStyle from "../../utilities/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
const UserDetailsButton = (props) => {
  return (
    <TouchableOpacity
      className="items-center flex-row rounded-2xl p-3"
      style={[
        {
          backgroundColor: appStyle.color_primary,
        },
        props.specialButton && {
          borderColor: appStyle.color_on_primary,
          borderWidth: 2,
        },
      ]}
      onPress={() => props.onPress()}
    >
      <Text style={{ fontSize: 30, color: appStyle.color_on_primary }}>
        {props.text}
      </Text>
      <View style={{ width: 10 }}></View>
      <View>
        <FontAwesomeIcon
          icon={props.icon}
          size={40}
          color={appStyle.color_on_primary}
        />
      </View>
      {props.smallIcon && (
        <View
          className="absolute rounded-full right-1 bottom-2 items-center justify-center"
          style={{ borderWidth: 1.5, borderColor: appStyle.color_primary }}
        >
          <FontAwesomeIcon
            icon={props.smallIcon}
            size={15}
            color={appStyle.color_on_primary}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default UserDetailsButton;
