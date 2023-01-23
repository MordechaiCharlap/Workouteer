import { View, Text } from "react-native";
import React from "react";

const Calendar = (props) => {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  return (
    <View>
      <Text>Today is {weekdays[today.getDay()]}</Text>
      <View>
        <View className="flex-row"></View>
      </View>
    </View>
  );
};

export default Calendar;
