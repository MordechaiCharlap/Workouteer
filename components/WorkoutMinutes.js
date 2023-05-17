import { View, Text, StyleSheet, Alert } from "react-native";
import { React, useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import languageService from "../services/languageService";
import * as appStyle from "../utilities/appStyleSheet";
import useAuth from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";
const data = [
  { label: "0:30", value: 30 },
  { label: "1:00", value: 60 },
  { label: "1:30", value: 90 },
  { label: "2:00", value: 120 },
  { label: "2:30", value: 150 },
  { label: "3:00", value: 180 },
];

const WorkoutMinutes = (props) => {
  const { user } = useAuth();
  const [value, setValue] = useState(props.value);
  const [isFocus, setIsFocus] = useState(false);
  useEffect(() => {
    props.minutesSelected(value);
  }, [value]);
  const handleMinutesChange = (item) => {
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
          {languageService[props.language].workoutMinutesPlaceholder}
        </Text>
      );
    }
    return null;
  };

  return (
    <View
      className={`flex-1 items-center flex-row${
        user.language == "hebrew" && "-reverse"
      }`}
    >
      {/* <Text style={{ fontSize: 16 }}>
        {languageService[props.language].hoursMinutes}:
      </Text> */}
      <FontAwesomeIcon
        icon={faStopwatch}
        color={appStyle.color_primary}
        size={30}
      />
      <View style={{ width: 10 }}></View>
      <Dropdown
        style={[
          styles.dropdown,
          value ? styles.valueChanged : styles.valueNotChanged,
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
          !isFocus
            ? languageService[props.language].choose[user.isMale ? 1 : 0]
            : "..."
        }
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
    flex: 1,
    height: 50,
    borderColor: appStyle.color_primary,
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  valueNotChanged: {
    backgroundColor: appStyle.color_background_variant,
  },
  valueChanged: {
    backgroundColor: appStyle.color_primary,
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
    fontSize: 16,
  },
  placeholderStyle: {
    textAlign: "center",
    color: appStyle.color_on_primary,
    fontSize: 16,
  },
  selectedTextStyle: {
    textAlign: "center",
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
