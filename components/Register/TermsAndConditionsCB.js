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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <CheckBox
          backgroundColor={appStyle.color_on_primary}
          valueColor={appStyle.color_primary}
          value={false}
          onValueChange={handleValueChanged}
        />
        <Text style={{ color: appStyle.color_on_primary }}>
          {"I agree to the "}
        </Text>
        <Text
          className="font-semibold underline"
          style={{
            color: appStyle.color_on_primary,
            fontWeight: 600,
            textDecorationLine: "underline",
          }}
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
