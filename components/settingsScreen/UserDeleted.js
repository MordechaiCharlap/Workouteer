import { View, Text } from "react-native";
import * as appStyle from "../../utils/appStyleSheet";
import languageService from "../../services/languageService";
import { useEffect } from "react";
import useNavbarDisplay from "../../hooks/useNavbarDisplay";
export const UserDeleted = (props) => {
  const { setShowNavbar } = useNavbarDisplay();
  useEffect(() => {
    setShowNavbar(false);
  });
  return (
    <View className="justify-center flex-1">
      <View
        className="rounded-lg m-4 p-4 gap-y-2"
        style={{ backgroundColor: appStyle.color_primary }}
      >
        <Text
          className="text-4xl font-semibold text-center"
          style={{ color: appStyle.color_on_primary }}
        >
          {languageService[props.language].theUser +
            " " +
            `'${props.id}'` +
            " " +
            languageService[props.language].deletedSuccessfully}
        </Text>
        <Text
          className="text-lg text-center"
          style={{ color: appStyle.color_on_primary }}
        >
          Feel free to comeback whenever
        </Text>
      </View>
    </View>
  );
};
