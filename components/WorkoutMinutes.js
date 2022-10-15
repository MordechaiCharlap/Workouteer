import { View, Text, StyleSheet } from "react-native";
import { React, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
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

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text
          className="rounded"
          style={[styles.label, isFocus && { color: appStyle.appDarkBlue }]}
        >
          Workout length (hours:minutes)
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: appStyle.appAzure }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Workout time period" : "..."}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          props.minutesSelected(item.value);
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default WorkoutMinutes;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  dropdown: {
    height: 50,
    borderColor: appStyle.appDarkBlue,
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
    fontWeight: 450,
    color: appStyle.appDarkBlue,
    backgroundColor: appStyle.appYellow,
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    color: appStyle.appDarkBlue,
    fontWeight: 600,
    fontSize: 16,
  },
  selectedTextStyle: {
    fontWeight: 600,
    color: appStyle.appDarkBlue,
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
