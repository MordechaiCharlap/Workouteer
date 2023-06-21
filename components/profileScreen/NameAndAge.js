import { View, Text } from "react-native";
import React from "react";
import * as appStyle from "../../utils/appStyleSheet";
import CustomText from "../basic/CustomText";
const NameAndAge = ({ name, age, color }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <CustomText
        style={{
          fontSize: 16,
          color: appStyle.color_surface,
          borderRadius: 5,
          paddingVertical: 3,
          paddingHorizontal: 5,
          backgroundColor: color,
        }}
      >
        {name + "," + " " + age}
      </CustomText>
    </View>
  );
};

export default NameAndAge;
