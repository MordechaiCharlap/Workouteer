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

const WorkoutMaximumWaiting = (props) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text
          className="rounded"
          style={[styles.label, isFocus && { color: appStyle.appDarkBlue }]}
        >
          Maximum waiting time
        </Text>
      );
    }
    return null;
  };

  return (
    <View>
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
        placeholder={!isFocus ? "How long are you willing to wait" : "..."}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          props.waitingTimeSelected(item.value);
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default WorkoutMaximumWaiting;

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: appStyle.appGray,
    height: 50,
    borderColor: appStyle.appLightBlue,
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
    color: appStyle.appLightBlue,
    backgroundColor: appStyle.appDarkBlue,
    left: 22,
    top: -10,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    color: appStyle.appDarkBlue,
    fontSize: 16,
  },
  selectedTextStyle: {
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
