import { View, Text } from "react-native";
import React from "react";
import * as appStyle from "../../utilities/appStyleSheet";
const NameAndAge = (props) => {
  return (
    <View className="flex-row">
      <Text
        className="px-4 py-2 rounded-xl text-3xl"
        style={{
          color: appStyle.color_on_primary,
          backgroundColor: appStyle.color_primary,
        }}
      >
        {props.name} {props.age}
      </Text>
    </View>
  );
};

export default NameAndAge;
