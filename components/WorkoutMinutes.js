import { View, Text, StyleSheet, Alert } from "react-native";
import { React, useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import languageService from "../services/languageService";
import * as appStyle from "./AppStyleSheet";
const data = [
  { label: "0:30", value: 30 },
  { label: "1:00", value: 60 },
  { label: "1:30", value: 90 },
  { label: "2:00", value: 120 },
  { label: "2:30", value: 150 },
  { label: "3:00", value: 180 },
];

const WorkoutMinutes = (props) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  useEffect(() => {
    if (value == false) setValue(null);
  }, [value]);
  useEffect(() => {
    setValue(null);
  }, [props.workoutDate]);
  const handleMinutesChange = (item) => {
    props.minutesSelected(item.value);
    setValue(item.value);
    setIsFocus(false);
  };

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text
          className="rounded"
          style={[
            styles.label,
            isFocus && { color: appStyle.color_on_primary },
          ]}
        >
          Workout length (hours:minutes)
        </Text>
      );
    }
    return null;
  };

  return (
    <View>
      {renderLabel()}
      <Dropdown
        style={[
          styles.dropdown,
          isFocus && { borderColor: appStyle.color_on_primary },
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={
          !isFocus ? languageService[props.language].workoutTimePeiod : "..."
        }
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          handleMinutesChange(item);
        }}
      />
    </View>
  );
};

export default WorkoutMinutes;

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: appStyle.color_primary,
    height: 50,
    borderColor: appStyle.color_primary,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
    color: "white",
  },
  label: {
    position: "absolute",
    color: appStyle.color_on_primary,
    backgroundColor: appStyle.color_primary,
    left: 22,
    top: -10,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    color: appStyle.color_on_primary,
    fontSize: 16,
  },
  selectedTextStyle: {
    color: appStyle.color_on_primary,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
