import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import * as appStyle from "./AppStyleSheet";

const WorkoutDescription = (props) => {
  return (
    <View>
      <Text style={{ color: appStyle.color_on_primary }}>Details:</Text>
      <TextInput
        style={{
          textAlignVertical: "top",
          backgroundColor: appStyle.color_primary,
          borderRadius: 8,
          padding: 8,
        }}
        multiline
        placeholder="Optional text"
        placeholderTextColor={appStyle.color_bg_variant}
        numberOfLines={4}
        onChangeText={(text) => props.descChanged(text)}
      ></TextInput>
    </View>
  );
};

export default WorkoutDescription;
