import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import CheckBox from "../CheckBox";
import * as appStyle from "../AppStyleSheet";

const TermsAndConditionsCB = (props) => {
  const handleValueChanged = (value) => {
    props.valueChanged(value);
  };
  return (
    <View style={props.style.inputContainer}>
      <View className="flex-row items-center">
        <CheckBox
          backgroundColor={appStyle.color_on_primary}
          valueColor={appStyle.color_primary}
          value={false}
          onValueChange={handleValueChanged}
        />
        <Text className="ml-2" style={{ color: appStyle.color_on_primary }}>
          {"I agree to the "}
        </Text>
        <Text
          className="font-semibold underline"
          style={{ color: appStyle.color_on_primary }}
        >
          Terms and Conditions
        </Text>
      </View>
      <Text
        style={{
          color: appStyle.color_error,
          display: props.error ? "flex" : "none",
        }}
      >
        {props.error}
      </Text>
    </View>
  );
};

export default TermsAndConditionsCB;
