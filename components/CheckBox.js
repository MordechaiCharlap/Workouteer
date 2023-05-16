import { TouchableOpacity, StyleSheet } from "react-native";
import { React, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
const CheckBox = (props) => {
  const [value, setValue] = useState(props.value == null ? false : props.value);
  const changeValue = () => {
    if (props.onValueChange != null) props.onValueChange(!value);
    setValue(!value);
  };
  const style = StyleSheet.create({
    valueStyle: {
      color: props.valueColor == null ? "black" : props.valueColor,
      size: props.size == null ? 25 : props.size / 1.5,
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
        return (
          <FontAwesomeIcon
            icon={faCheck}
            color={style.valueStyle.color}
            size={style.valueStyle.size}
          />
        );
      }
    }
  };
  return (
    <TouchableOpacity
      className="aspect-square items-center justify-center"
      style={[
        style.checkBoxStyle,
        props.style ? props.style : { borderRadius: 3 },
      ]}
      onPress={changeValue}
    >
      {renderValue()}
    </TouchableOpacity>
  );
};

export default CheckBox;
