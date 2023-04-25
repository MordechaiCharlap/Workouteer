import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import * as appStyle from "../utilites/appStyleSheet";
import languageService from "../services/languageService";

const WorkoutDescription = (props) => {
  return (
    <View>
      <Text style={{ color: appStyle.color_primary, fontSize: 15 }}>
        {languageService[props.language].details}:
      </Text>
      <TextInput
        style={{
          textAlignVertical: "top",
          backgroundColor: appStyle.color_primary,
          borderRadius: 8,
          padding: 8,
          color: appStyle.color_on_primary,
        }}
        autoCorrect={false}
        multiline
        placeholder={languageService[props.language].optionalText}
        placeholderTextColor={appStyle.color_lighter}
        numberOfLines={4}
        onChangeText={(text) => props.descChanged(text)}
      ></TextInput>
    </View>
  );
};

export default WorkoutDescription;
