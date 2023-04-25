import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as appStyle from "../../utilities/appStyleSheet";

const BirthdayDatePicker = (props) => {
  const [dateStyle, setDateStyle] = useState(props.style.input);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [changedOnce, setChangeOnce] = useState(false);
  const [error, setError] = useState(null);
  const showDatepicker = () => {
    setShow(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setShow(false);
    setChangeOnce(true);
    const age = calculateAge(currentDate);
    if (age < 0) {
      setDateStyle(props.style.badInput);
      setError("0_0");
      props.valueChanged(null);
    } else if (age < 16) {
      setDateStyle(props.style.badInput);
      setError("You have to be 16 and up");
      props.valueChanged(null);
    } else {
      setDateStyle(props.style.input);
      setError(null);
      props.valueChanged(currentDate);
    }
  };

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
    // Added view to remove error when compiling DatePicker
    <View>
      <View className="gap-1" style={props.style.inputContainer}>
        <TouchableOpacity style={dateStyle} onPress={showDatepicker}>
          {!changedOnce ? (
            <Text style={{ color: "#5f6b8b" }}>Birthdate</Text>
          ) : (
            <Text style={{ color: "#5f6b8b" }}>{date.toDateString()}</Text>
          )}
        </TouchableOpacity>
        <Text
          style={{
            color: appStyle.color_error,
            display: error ? "flex" : "none",
          }}
        >
          {error}
        </Text>
      </View>
      {show && (
        <View>
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            onChange={onDateChange}
          />
        </View>
      )}
    </View>
  );
};

export default BirthdayDatePicker;
