import { View, Text } from "react-native";
import * as appStyle from "../AppStyleSheet";
export const UserDeleted = (props) => {
  return (
    <View
      className="p-2 rounded-lg"
      style={{ backgroundColor: appStyle.color_on_primary }}
    >
      <Text
        className="text-2xl font-semibold"
        style={{ color: appStyle.color_primary }}
      >
        {props.id} deleted succesfuly.
      </Text>
      <Text className="text-lg" style={{ color: appStyle.color_primary }}>
        Feel free to comeback whenever
      </Text>
    </View>
  );
};
