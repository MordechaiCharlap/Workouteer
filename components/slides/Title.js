import { View, Text } from "react-native";
import * as appStyle from "../../utilities/appStyleSheet";
import CustomText from "../basic/CustomText";
export const Title = ({ title, color }) => {
  return (
    <View>
      <View className="flex-1"></View>
      <CustomText
        className="text-center text-lg"
        style={{ color: color||appStyle.color_on_background }}
      >?
        {title}
      </CustomText>
    </View>
  );
};
