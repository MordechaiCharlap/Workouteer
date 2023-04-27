import { View, Text, TouchableOpacity, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import CheckBox from "../CheckBox";
import * as appStyle from "../../utilities/appStyleSheet";

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
        <View className="ml-3 flex-1 flex-row flex-wrap">
          <Text style={{ color: appStyle.color_on_primary }}>
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
          <Text style={{ color: appStyle.color_on_primary, marginLeft: 5 }}>
            {"and the "}
          </Text>
          <TouchableOpacity>
            <Text
              className={Platform.OS != "web" ? "font-semibold underline" : ""}
              style={{
                color: appStyle.color_on_primary,
              }}
            >
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
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
