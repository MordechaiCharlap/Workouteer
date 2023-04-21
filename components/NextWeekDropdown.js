import { View, StyleSheet } from "react-native";
import * as appStyle from "./AppStyleSheet";
import React, { useState, useEffect } from "react";
import { Dropdown } from "react-native-element-dropdown";
import languageService from "../services/languageService";
const NextWeekDropdown = (props) => {
  const now = props.now;
  const language = props.language;
  const [isWeekdaysFocused, setIsWeekdaysFocused] = useState(false);
  const [weekdays, setWeekdays] = useState([]);
  const [weekday, setWeekday] = useState(now);
  const [isHoursFocused, setIsHoursFocused] = useState(false);
  const [hours, setHours] = useState([]);
  const [hour, setHour] = useState(now.getHours());
  const [minutes, setMinutes] = useState();
  useEffect(() => {
    const currentDay = now.getDay();
    const weekdaysArr = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const num = (currentDay + i) % 7;
      weekdaysArr.push({
        label:
          i == 0
            ? languageService[language].weekdays[num] +
              ` (${languageService[language].today})`
            : languageService[language].weekdays[num],
        value: today,
      });
      today.setDate(today.getDate() + 1);
    }

    console.log(weekdaysArr);
    setWeekdays(weekdaysArr);
  }, []);
  useEffect(() => {
    const isToday = weekday.getDay() === now.getDay();
    // Get the current hour and minute
    const currentHour = now.getHours();
    setHour(currentHour);
    const currentMinute = now.getMinutes();

    // Create an empty array to store the time intervals
    const timeIntervals = [];

    for (let hour = 0; hour < 24; hour++) {
      if (isToday && hour < currentHour) continue;
      console.log(hour + " " + currentHour);
      timeIntervals.push({
        label: hour,
        value: hour,
      });
    }
    setHours(timeIntervals);
  }, [weekday]);
  return (
    <View className="flex-row justify-between">
      <Dropdown
        style={[
          style.dropdown,
          isWeekdaysFocused && { borderColor: appStyle.color_primary },
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
        value={weekdays[0]}
        onFocus={() => setIsWeekdaysFocused(true)}
        onBlur={() => setIsWeekdaysFocused(false)}
        onChange={(item) => {
          setWeekday(item.value);
          setIsWeekdaysFocused(false);
        }}
      />
      <Dropdown
        style={[
          style.dropdown,
          isHoursFocused && { borderColor: appStyle.color_primary },
        ]}
        placeholder={languageService[language].hour}
        placeholderStyle={style.placeholderStyle}
        selectedTextStyle={style.selectedTextStyle}
        inputSearchStyle={style.inputSearchStyle}
        iconStyle={style.iconStyle}
        data={hours}
        maxHeight={300}
        labelField="label"
        valueField="value"
        value={hour}
        onFocus={() => setIsHoursFocused(true)}
        onBlur={() => setIsHoursFocused(false)}
        onChange={(item) => {
          setHour(item.value);
          setIsHoursFocused(false);
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
    flexGrow: 1,
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
