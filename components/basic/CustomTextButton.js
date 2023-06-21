import React from "react";
import { color_on_primary, color_primary } from "../../utils/appStyleSheet";
import { View, TouchableOpacity } from "react-native";
import CustomText from "./CustomText";
const CustomTextButton = ({ type, children, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: type == "primary" ? color_primary : color_on_primary,
      }}
    >
      <CustomText type={type == "primary" ? "seconday" : "primary"}>
        {children}
      </CustomText>
    </TouchableOpacity>
  );
};

export default CustomTextButton;
