import { View, StyleSheet } from "react-native";
import * as appStyle from "./AppStyleSheet";
import React, { useState, useEffect } from "react";
import { Dropdown } from "react-native-element-dropdown";
import languageService from "../services/languageService";
const NextWeekDropdown = (props) => {
  const now = props.now;
  const language = props.language;
  const [weekday, setWeekday] = useState(now);
  const [weekdays, setWeekdays] = useState([]);
  const [isWeekdaysFocused, setIsWeekdaysFocused] = useState(false);
  const [hour, setHour] = useState();
  const [hours, setHours] = useState([]);
  const [isHoursFocused, setIsHoursFocused] = useState(false);
  const [minute, setMinute] = useState();
  const [minutes, setMinutes] = useState();
  const [isMinutesFocused, setIsMinutesFocused] = useState(false);
  useEffect(() => {
    const currentDay = now.getDay();
    const weekdaysArr = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const num = (currentDay + i) % 7;
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const formattedDate = `${day}/${month}`;
      weekdaysArr.push({
        label:
          i == 0
            ? languageService[language].weekdays[num] +
              ` (${languageService[language].today})`
            : i == 1
            ? languageService[language].weekdays[num] +
              ` (${languageService[language].tomorrow})`
            : languageService[language].weekdays[num] + ` ${formattedDate}`,
        value: new Date(today),
      });
      today.setDate(today.getDate() + 1);
    }
    setWeekdays(weekdaysArr);
    setWeekday(weekdaysArr[0].value);
  }, []);
  useEffect(() => {
    console.log("Weekday changed!");
    const isToday = weekday.getDay() === now.getDay();
    // Get the current hour and minute
    const currentHour = now.getHours();
    setHour(currentHour);

    // Create an empty array to store the time intervals
    const hoursInterval = [];

    for (let hour = 0; hour < 24; hour++) {
      if (
        isToday &&
        (hour < currentHour || (hour == currentHour && now.getMinutes() >= 45))
      )
        continue;
      hoursInterval.push({
        label: hour.toString().padStart(2, "0"),
        value: hour,
      });
    }
    setHours(hoursInterval);
    setHour(hoursInterval[0].value);
  }, [weekday]);
  useEffect(() => {
    console.log("Hour changed!");
    const minutesInterval = [];
    const currentMinute = now.getMinutes();
    const currentHour = now.getHours();
    for (let minute = 0; minute < 60; minute += 15) {
      if (
        weekday.getDay() === now.getDay() &&
        hour == currentHour &&
        currentMinute > minute
      ) {
        continue;
      }

      minutesInterval.push({
        label: minute.toString().padStart(2, "0"),
        value: minute,
      });

      console.log(`${hour}:${minute}`);
    }
    setMinutes(minutesInterval);
    setMinute(minutesInterval[0].value);
  }, [hour]);
  return (
    <View className="flex-row">
      <Dropdown
        style={[
          style.dropdown,
          { flexGrow: 1 },
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
      <View className="flex-row">
        <Dropdown
          style={[
            style.dropdown,
            { width: 70 },
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
        <Dropdown
          style={[
            style.dropdown,
            { width: 70 },
            isMinutesFocused && { borderColor: appStyle.color_primary },
          ]}
          placeholder={languageService[language].minutes}
          placeholderStyle={style.placeholderStyle}
          selectedTextStyle={style.selectedTextStyle}
          inputSearchStyle={style.inputSearchStyle}
          iconStyle={style.iconStyle}
          data={minutes}
          maxHeight={300}
          labelField="label"
          valueField="value"
          value={minute}
          onFocus={() => setIsMinutesFocused(true)}
          onBlur={() => setIsMinutesFocused(false)}
          onChange={(item) => {
            setMinute(item.value);
            setIsMinutesFocused(false);
          }}
        />
      </View>
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

export default NextWeekDropdown;
