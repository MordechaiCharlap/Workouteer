import { View, Text } from "react-native";
import * as appStyle from "../../utilities/appStyleSheet";
export const Title = (props) => {
  return (
    <View>
      <View className="flex-1"></View>
      <Text
        className="text-center text-lg"
        style={{ color: appStyle.color_primary }}
      >
        {props.title}
      </Text>
    </View>
  );
};
