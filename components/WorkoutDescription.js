import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import * as appStyle from "./AppStyleSheet";

const WorkoutDescription = (props) => {
  return (
    <View>
      <Text style={style.label}>Details:</Text>
      <TextInput
        style={{
          textAlignVertical: "top",
          backgroundColor: appStyle.appLightBlue,
          borderRadius: 8,
          padding: 8,
        }}
        multiline
        placeholder="Optional text"
        placeholderTextColor={"#72757b"}
        numberOfLines={4}
        onChangeText={(text) => props.descChanged(text)}
      ></TextInput>
    </View>
  );
};

export default WorkoutDescription;

const style = StyleSheet.create({
  label: {
    color: appStyle.appGray,
  },
});
