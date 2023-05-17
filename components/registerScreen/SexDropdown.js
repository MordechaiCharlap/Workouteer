import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import * as appStyle from "../../utilities/appStyleSheet";
const SexDropdown = (props) => {
  const [isMale, setIsMale] = useState();
  useEffect(() => {
    props.valueChanged(isMale);
  }, [isMale]);
  return (
    <View style={props.style.inputContainer}>
      <Dropdown
        style={props.error ? props.style.badInput : props.style.input}
        containerStyle={{
          borderTopWidth: 0,
          borderBottomWidth: 2,
          borderRightWidth: 2,
          borderLeftWidth: 2,
          borderColor: appStyle.color_background,
        }}
        itemContainerStyle={{
          position: "relative",
          paddingLeft: 10,
          height: 40,
        }}
        itemTextStyle={{
          position: "absolute",
          fontSize: 16,
        }}
        selectedTextStyle={{ fontSize: 16 }}
        placeholderStyle={{
          color: props.error ? appStyle.color_error : appStyle.color_outline,
          fontSize: 16,
        }}
        dropdownPosition="bottom"
        placeholder="Sex"
        data={[
          { label: "Male", value: true },
          { label: "Female", value: false },
        ]}
        maxHeight={300}
        labelField="label"
        valueField="value"
        value={isMale}
        onChange={(item) => {
          setIsMale(item.value);
        }}
      />
    </View>
  );
};

export default SexDropdown;
