import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMaximize,
  faMinimize,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import {
  color_on_primary_container,
  color_on_surface_variant,
  color_primary_container,
  color_surface_variant,
} from "../../utils/appStyleSheet";
import CustomText from "../basic/CustomText";
import CustomButton from "../basic/CustomButton";

const SuggestionHeader = ({
  maximized,
  title,
  maximizeSuggestion,
  minimizeSuggestion,
  deleteSuggestion,
}) => {
  return (
    <View className="flex-row items-center justify-between">
      <CustomText className="font-semibold text-xl">{title}</CustomText>
      <View className="flex-row" style={{ columnGap: 5 }}>
        {maximized && (
          <CustomButton
            className="rounded"
            style={{ backgroundColor: color_surface_variant }}
            onPress={deleteSuggestion}
          >
            <FontAwesomeIcon
              icon={faTrash}
              size={30}
              color={color_on_surface_variant}
            />
          </CustomButton>
        )}
        <CustomButton
          className="rounded"
          style={{
            backgroundColor: maximized
              ? color_primary_container
              : color_surface_variant,
          }}
          onPress={maximized ? minimizeSuggestion : maximizeSuggestion}
        >
          <FontAwesomeIcon
            icon={maximized ? faMinimize : faMaximize}
            size={30}
            color={
              maximized ? color_on_primary_container : color_on_surface_variant
            }
          />
        </CustomButton>
      </View>
    </View>
  );
};

export default SuggestionHeader;
