import { View } from "react-native";
import React from "react";
import CustomText from "../basic/CustomText";
import languageService from "../../services/languageService";
import appComponentsDefaultStyles from "../../utils/appComponentsDefaultStyles";
import * as appStyle from "../../utils/appStyleSheet";
const UserDescription = ({ description, language }) => {
  return (
    <View
      className="rounded-xl p-4"
      style={[
        {
          backgroundColor: appStyle.color_surface_variant,
          borderWidth: 0.5,
          borderColor: appStyle.color_outline,
        },
      ]}
    >
      <CustomText
        style={{ color: appStyle.color_on_background }}
        className="text-lg"
      >
        {description == ""
          ? languageService[language].noDescriptionYet
          : description}
      </CustomText>
    </View>
  );
};

export default UserDescription;
