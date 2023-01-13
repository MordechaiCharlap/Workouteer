import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

const BirthdayDatePicker = (props) => {
  const [dateStyle, setDateStyle] = useState(props.style.input);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [changedOnce, setChangeOnce] = useState(false);

  const showDatepicker = () => {
    setShow(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setShow(false);
    setChangeOnce(true);
    const age = calculateAge(currentDate);
    if (age < 16) {
      console.log(age);
      if (Platform.OS != "web")
        alert("You need to be at least 16 to use this app");
      setDateStyle(props.style.badInput);
    } else {
      setDateStyle(props.style.input);
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

  return (
    <View>
      <TouchableOpacity
        className="justify-center"
        style={dateStyle}
        onPress={showDatepicker}
      >
        {!changedOnce && <Text style={{ color: "#5f6b8b" }}>Birthdate</Text>}
        {changedOnce && (
          <Text style={{ color: "#5f6b8b" }}>{date.toDateString()}</Text>
        )}
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          onChange={onDateChange}
        />
      )}
    </View>
  );
};

export default BirthdayDatePicker;
