import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as appStyle from "../../utils/appStyleSheet";
import CustomButton from "../basic/CustomButton";
import CustomText from "../basic/CustomText";

const BirthdayDatePicker = (props) => {
  const [dateStyle, setDateStyle] = useState(
    props.error ? props.style.badInput : props.style.input
  );
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
      <View>
        <CustomButton style={dateStyle} onPress={showDatepicker}>
          {!changedOnce ? (
            <CustomText
              style={{
                color: props.error
                  ? appStyle.color_error
                  : appStyle.color_outline,
              }}
            >
              Birthdate
            </CustomText>
          ) : (
            <CustomText
              style={{
                color: error
                  ? appStyle.color_error
                  : appStyle.color_on_surface_variant,
              }}
            >
              {date.toDateString()}
            </CustomText>
          )}
        </CustomButton>
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
