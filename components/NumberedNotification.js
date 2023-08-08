import { View, Text } from "react-native";
import React from "react";
import AlertDot from "./AlertDot";
import * as appStyle from "../utils/appStyleSheet";
const NumberedNotification = ({
  number,
  alert,
  style,
  color,
  surfaceColor,
}) => {
  return (
    <View>
      <AlertDot
        size={26}
        text={number}
        textColor={appStyle.color_on_primary}
        color={appStyle.color_primary}
        borderColor={surfaceColor}
        borderWidth={surfaceColor && 1.5}
      />
      {alert ? (
        <View className="absolute right-0 bottom-0">
          <AlertDot
            size={10}
            color={appStyle.color_error}
            borderColor={surfaceColor}
            borderWidth={2}
          />
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default NumberedNotification;
