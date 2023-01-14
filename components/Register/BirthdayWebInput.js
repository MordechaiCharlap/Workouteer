import { View, Text, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import * as appStyle from "../AppStyleSheet";
const BirthdayWebInput = (props) => {
  const [day, setDay] = useState();
  const [dayStyle, setDayStyle] = useState(props.style.input);
  const [month, setMonth] = useState();
  const [monthStyle, setMonthStyle] = useState(props.style.input);
  const [year, setYear] = useState();
  const [yearStyle, setYearStyle] = useState(props.style.input);
  const [error, setError] = useState(null);

  const dayLostFocus = (dayInput) => {
    var validRegex = /[0-9]{2}/;
    if (
      dayInput.match(validRegex) &&
      parseInt(dayInput) >= 1 &&
      parseInt(dayInput) <= 31
    ) {
      setDayStyle(props.style.input);
      setDay(dayInput);
      checkDate();
    } else {
      setDayStyle(props.style.badInput);
      setDay(null);
    }
  };
  const monthLostFocus = (monthInput) => {
    var validRegex = /[0-9]{2}/;
    if (
      monthInput.match(validRegex) &&
      parseInt(monthInput) >= 1 &&
      parseInt(monthInput) <= 12
    ) {
      setMonthStyle(props.style.input);
      setMonth(monthInput);
      checkDate();
    } else {
      setMonthStyle(props.style.badInput);
      setMonth(null);
    }
  };
  const yearLostFocus = (yearInput) => {
    var validRegex = /[0-9]{4}/;
    if (yearInput.match(validRegex) && yearInput(monthInput) >= 1900) {
      setYearStyle(props.style.input);
      setYear(yearInput);
      checkDate();
    } else {
      setYearStyle(props.style.badInput);
      setYear(null);
    }
  };
  const checkDate = () => {};
  const calculateAge = (dateToCheck) => {
    var today = new Date();
    var age = today.getFullYear() - dateToCheck.getFullYear();
    var m = today.getMonth() - dateToCheck.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dateToCheck.getDate())) {
      age--;
    }
    console.log(age);
    return age;
  };

  return (
    <View className="gap-1" style={props.style.inputContainer}>
      <Text
        className="mb-3 text-xl font-semibold"
        style={{ color: appStyle.color_on_primary }}
      >
        Birthdate
      </Text>
      <View className="flex-row w-full items-center justify-between">
        <TextInput
          onBlur={(text) => dayLostFocus(text)}
          maxLength={2}
          className="text-center  w-20"
          placeholderTextColor={"#5f6b8b"}
          placeholder="Day dd"
          style={dayStyle}
        ></TextInput>
        <TextInput
          onBlur={(text) => monthLostFocus(text)}
          maxLength={2}
          className="text-center w-20"
          placeholderTextColor={"#5f6b8b"}
          placeholder="Month mm"
          style={monthStyle}
        ></TextInput>
        <TextInput
          onBlur={(text) => yearLostFocus(text)}
          maxLength={4}
          className="text-center w-20"
          placeholderTextColor={"#5f6b8b"}
          placeholder="Year yyyy"
          style={yearStyle}
        ></TextInput>
      </View>
    </View>
  );
};

export default BirthdayWebInput;
