import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import * as appStyle from "../utils/appStyleSheet";
import languageService from "../services/languageService";
import useAuth from "../hooks/useAuth";
import appComponentsDefaultStyles from "../utils/appComponentsDefaultStyles";

const WorkoutDescription = ({ descChanged, color }) => {
  const { user } = useAuth();
  return (
    <View>
      <Text style={{ color: appStyle.color_on_background, fontSize: 15 }}>
        {languageService[user.language].details}:
      </Text>
      <TextInput
        style={{
          textAlignVertical: "top",
          borderWidth: 0.5,
          borderColor: appStyle.color_outline,
          backgroundColor: appStyle.color_surface_variant,
          borderRadius: 4,
          padding: 8,
          color: color,
        }}
        autoCorrect={false}
        multiline
        placeholder={languageService[user.language].optionalText}
        placeholderTextColor={appStyle.color_outline}
        numberOfLines={10}
        onChangeText={(text) => descChanged(text)}
      ></TextInput>
    </View>
  );
};

export default WorkoutDescription;
