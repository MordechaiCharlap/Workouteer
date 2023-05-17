import { View, Text, TouchableOpacity, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import CheckBox from "../CheckBox";
import * as appStyle from "../../utilities/appStyleSheet";
import { useNavigation } from "@react-navigation/native";
const TermsAndConditionsCB = (props) => {
  const navigation = useNavigation();
  const handleValueChanged = (value) => {
    props.valueChanged(value);
  };
  return (
    <View>
      <View className="flex-row items-center">
        <CheckBox
          backgroundColor={
            props.error ? appStyle.color_error : appStyle.color_primary
          }
          valueColor={appStyle.color_on_primary}
          value={false}
          onValueChange={handleValueChanged}
        />
        <View className="ml-3 flex-1 flex-row flex-wrap">
          <Text
            style={{
              color: props.error
                ? appStyle.color_error
                : appStyle.color_primary,
            }}
          >
            {"I agree to the "}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("TermsOfService")}
          >
            <Text
              className={Platform.OS != "web" ? "font-semibold underline" : ""}
              style={{
                color: props.error
                  ? appStyle.color_error
                  : appStyle.color_primary,
              }}
            >
              Terms of Service
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: props.error
                ? appStyle.color_error
                : appStyle.color_primary,
              marginLeft: 5,
            }}
          >
            {"and the "}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("PrivacyPolicy")}
          >
            <Text
              className={Platform.OS != "web" ? "font-semibold underline" : ""}
              style={{
                color: props.error
                  ? appStyle.color_error
                  : appStyle.color_primary,
              }}
            >
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TermsAndConditionsCB;
