import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import * as appStyle from "../AppStyleSheet";
const SexDropdown = (props) => {
  const [isMale, setIsMale] = useState();
  useEffect(() => {
    props.valueChanged(isMale);
  }, [isMale]);
  const style = new StyleSheet.create({
    iconStyle: {
      width: 20,
      height: 20,
    },
  });

  return (
    <Dropdown
      style={props.style}
      containerStyle={{
        borderTopWidth: 0,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        borderColor: appStyle.color_bg,
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
      placeholderStyle={{ color: "#5f6b8b", fontSize: 16 }}
      dropdownPosition="bottom"
      placeholder="Sex"
      iconStyle={style.iconStyle}
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
  );
};

export default SexDropdown;
