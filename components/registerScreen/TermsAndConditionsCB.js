import { View, Text, TouchableOpacity, Platform } from "react-native";
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
        }}
      >
        <CheckBox
          backgroundColor={appStyle.color_on_primary}
          valueColor={appStyle.color_primary}
          value={false}
          onValueChange={handleValueChanged}
        />
        <Text style={{ color: appStyle.color_on_primary, marginLeft: 5 }}>
          {"I agree to the "}
        </Text>
        <TouchableOpacity>
          <Text
            className={Platform.OS != "web" ? "font-semibold underline" : ""}
            style={{
              color: appStyle.color_on_primary,
            }}
          >
            Terms and Conditions
          </Text>
        </TouchableOpacity>
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
