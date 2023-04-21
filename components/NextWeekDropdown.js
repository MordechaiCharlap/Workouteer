import { View, StyleSheet } from "react-native";
import * as appStyle from "./AppStyleSheet";
import React, { useState, useEffect } from "react";
import { Dropdown } from "react-native-element-dropdown";
import languageService from "../services/languageService";
const NextWeekDropdown = (props) => {
  const now = props.now;
  const language = props.language;
  const [isFocused, setIsFocused] = useState(false);
  const [weekdays, setWeekdays] = useState([]);
  const [weekday, setWeekday] = useState(0);
  useEffect(() => {
    const currentDay = now.getDay();
    const weekdaysArr = [];
    for (let i = 0; i < 7; i++) {
      const num = (currentDay + i) % 7;
      weekdaysArr.push({
        label: languageService[language].weekdays[num],
        value: num,
      });
    }

    console.log(weekdaysArr);
    setWeekdays(weekdaysArr);
  }, []);

  return (
    <View>
      <Dropdown
        style={[
          style.dropdown,
          isFocused && { borderColor: appStyle.color_primary },
        ]}
        placeholder={languageService[language].day}
        placeholderStyle={style.placeholderStyle}
        selectedTextStyle={style.selectedTextStyle}
        inputSearchStyle={style.inputSearchStyle}
        iconStyle={style.iconStyle}
        data={weekdays}
        maxHeight={300}
        labelField="label"
        valueField="value"
        value={123}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(item) => {
          setWeekday(item);
          setIsFocused(false);
        }}
      />
    </View>
  );
};
const style = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#5f6b8b",
    color: appStyle.color_on_primary,
  },
  text: { color: appStyle.color_on_primary },
  container: {
    paddingHorizontal: 16,
  },
  dropdown: {
    backgroundColor: appStyle.color_primary,
    height: 50,
    borderColor: appStyle.color_on_primary,
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
    color: "white",
  },
  placeholderStyle: {
    color: "#5f6b8b",
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

export default NextWeekDropdown;
