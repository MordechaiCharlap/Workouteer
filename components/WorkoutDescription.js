import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import * as appStyle from "../utils/appStyleSheet";
import languageService from "../services/languageService";
import useAuth from "../hooks/useAuth";

const WorkoutDescription = ({ descChanged, color }) => {
  const { user } = useAuth();
  return (
    <View>
      <Text style={{ color: appStyle.color_primary, fontSize: 15 }}>
        {languageService[user.language].details}:
      </Text>
      <TextInput
        style={{
          textAlignVertical: "top",
          backgroundColor: color,
          borderRadius: 4,
          padding: 8,
          color: appStyle.color_on_primary,
        }}
        autoCorrect={false}
        multiline
        placeholder={languageService[user.language].optionalText}
        placeholderTextColor={appStyle.color_lighter}
        numberOfLines={10}
        onChangeText={(text) => descChanged(text)}
      ></TextInput>
    </View>
  );
};

export default WorkoutDescription;
