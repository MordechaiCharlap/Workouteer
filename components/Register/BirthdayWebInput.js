import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";

const BirthdayWebInput = (props) => {
  const [day, setDay] = useState();
  const [dayStyle, setDayStyle] = useState(props.style.input);
  const [month, setMonth] = useState();
  const [monthStyle, setMonthStyle] = useState(props.style.input);
  const [year, setYear] = useState();
  const [yearStyle, setYearStyle] = useState(props.style.input);

  const dayLostFocus = () => {
    var validRegex = /[0-9]{2}/;
    if (day.match(validRegex)) {
      setDayStyle(props.style.input);
    } else {
      setDayStyle(props.style.badInput);
    }
  };
  const monthLostFocus = () => {
    var validRegex = /[0-9]{2}/;
    if (month.match(validRegex)) {
      setMonthStyle(props.style.input);
    } else {
      setMonthStyle(props.style.badInput);
    }
  };
  const yearLostFocus = () => {
    var validRegex = /[0-9]{2}/;
    if (year.match(validRegex)) {
      setYearStyle(props.style.input);
    } else {
      setYearStyle(props.style.badInput);
    }
  };

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

  const checkWebDate = () => {
    if (
      day.length == 2 &&
      !isNaN(day) &&
      month.length == 2 &&
      !isNaN(month) &&
      year.length == 4 &&
      !isNaN(year)
    )
      return true;
    console.log("not a good web date");
    return false;
  };

  return (
    <View>
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
          className="text-center w-20"
          placeholderTextColor={"#5f6b8b"}
          placeholder="Day dd"
          style={dayStyle}
          onChangeText={(text) => setDay(text)}
        ></TextInput>
        <TextInput
          onBlur={(text) => monthLostFocus(text)}
          maxLength={2}
          className="text-center w-20"
          placeholderTextColor={"#5f6b8b"}
          placeholder="Month mm"
          style={monthStyle}
          onChangeText={(text) => setMonth(text)}
        ></TextInput>
        <TextInput
          onBlur={(text) => yearLostFocus(text)}
          maxLength={4}
          className="text-center w-20"
          placeholderTextColor={"#5f6b8b"}
          placeholder="Year yyyy"
          style={yearStyle}
          onChangeText={(text) => setYear(text)}
        ></TextInput>
      </View>
    </View>
  );
};

export default BirthdayWebInput;
