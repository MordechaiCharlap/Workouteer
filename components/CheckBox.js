import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { React, useState } from "react";
const CheckBox = (props) => {
  const [value, setValue] = useState(props.value == null ? false : props.value);
  const changeValue = () => setValue(!value);
  const style = StyleSheet.create({
    valueStyle: {
      color: props.valueColor == null ? "black" : props.valueColor,
    },
    checkBoxStyle: {
      backgroundColor:
        props.backgroundColor == null ? "white" : props.backgroundColor,
      width: props.size == null ? 25 : props.size,
      height: props.size == null ? 25 : props.size,
    },
  });

  const renderValue = () => {
    if (value != null) {
      if (value == true) {
        return <Text style={style.valueStyle}>V</Text>;
      }
    }
  };
  return (
    <TouchableOpacity
      className="aspect-square items-center justify-center"
      style={style.checkBoxStyle}
      onPress={changeValue}
    >
      {renderValue()}
    </TouchableOpacity>
  );
};

export default CheckBox;
