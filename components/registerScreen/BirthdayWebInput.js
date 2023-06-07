import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import * as appStyle from "../../utilities/appStyleSheet";
import appComponentsDefaultStyles from "../../utilities/appComponentsDefaultStyles";
import CustomTextInput from "../basic/CustomTextInput";
const BirthdayWebInput = (props) => {
  const [day, setDay] = useState();
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [dayStyle, setDayStyle] = useState(appComponentsDefaultStyles.input);
  const [monthStyle, setMonthStyle] = useState(
    appComponentsDefaultStyles.input
  );
  const [yearStyle, setYearStyle] = useState(appComponentsDefaultStyles.input);
  const [error, setError] = useState(null);

  const handleDayChanged = (dayInput) => {
    var validRegex = /[0-9]{2}/;
    if (
      dayInput.match(validRegex) &&
      parseInt(dayInput) >= 1 &&
      parseInt(dayInput) <= 31
    ) {
      setDayStyle(appComponentsDefaultStyles.input);
      setDay(dayInput);
    } else {
      setDayStyle(appComponentsDefaultStyles.errorInput);
      setDay(null);
    }
  };
  const handleMonthChanged = (monthInput) => {
    var validRegex = /[0-9]{2}/;
    if (
      monthInput.match(validRegex) &&
      parseInt(monthInput) >= 1 &&
      parseInt(monthInput) <= 12
    ) {
      setMonthStyle(appComponentsDefaultStyles.input);
      setMonth(monthInput);
    } else {
      setMonthStyle(appComponentsDefaultStyles.errorInput);
      setMonth(null);
    }
  };
  const handleYearChanged = (yearInput) => {
    var validRegex = /[0-9]{4}/;
    if (yearInput.match(validRegex) && yearInput >= 1900) {
      setYearStyle(appComponentsDefaultStyles.input);
      setYear(yearInput);
    } else {
      setYearStyle(appComponentsDefaultStyles.errorInput);
      setYear(null);
    }
  };
  useEffect(() => {
    if (day && month && year) {
      const date = new Date(year, month, day, 0, 0, 0, 0);
      if (calculateAge(date) >= 16) {
        setError(null);
        props.valueChanged(date);
      } else {
        setError("You need to be at least 16 to register");
        props.valueChanged(null);
      }
    }
  }, [day, month, year]);
  const calculateAge = (dateToCheck) => {
    var today = new Date();
    var age = today.getFullYear() - dateToCheck.getFullYear();
    var m = today.getMonth() - dateToCheck.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dateToCheck.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <View style={props.style.inputContainer}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: appStyle.color_on_surface,
          }}
        >
          {"Birthdate: "}
        </Text>
        <TextInput
          keyboardType="numeric"
          onChangeText={(text) => handleDayChanged(text)}
          maxLength={2}
          placeholderTextColor={"#5f6b8b"}
          placeholder="dd"
          style={[dayStyle, { width: "6ch", textAlign: "center" }]}
        ></TextInput>
        <TextInput
          keyboardType="numeric"
          onChangeText={(text) => handleMonthChanged(text)}
          maxLength={2}
          placeholderTextColor={"#5f6b8b"}
          placeholder="mm"
          style={[monthStyle, { width: "6ch", textAlign: "center" }]}
        ></TextInput>
        <TextInput
          keyboardType="numeric"
          onChangeText={(text) => handleYearChanged(text)}
          maxLength={4}
          className="text-center"
          placeholderTextColor={"#5f6b8b"}
          placeholder="yyyy"
          style={[yearStyle, { width: "12ch", textAlign: "center" }]}
        ></TextInput>
      </View>
      <Text style={{ color: appStyle.color_error }}>{error}</Text>
    </View>
  );
};

export default BirthdayWebInput;
