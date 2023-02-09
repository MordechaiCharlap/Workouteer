import { View, Text } from "react-native";
import React from "react";
import * as appStyle from "../../AppStyleSheet";
const WorkoutsStats = (props) => {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const renderStats = () => {
    console.log("rendering workouts");
    const week = [];
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 6);
    for (var i = 0; i < 7; i++) {
      var tempDate = new Date();
      tempDate.setDate(tempDate.getDate() - i);
      week.push(weekdays[tempDate.getDay()]);
    }
    for (var workout of Object.values(props.workouts)) {
      if (workout[0].toDate() >= weekAgo && workout[2] == true) {
        const index = now.getDate() - workout[0].toDate().getDate();
      }
    }
    const dayStyle = {
      backgroundColor: appStyle.color_primary,
      height: 50,
      width: 30,
    };
    return (
      <View className="flex-row-reverse gap-x-3 justify-between">
        <View style={dayStyle}>
          <Text>Today</Text>
        </View>
        <View style={dayStyle}></View>
        <View style={dayStyle}></View>
        <View style={dayStyle}></View>
        <View style={dayStyle}></View>
        <View style={dayStyle}></View>
        <View style={dayStyle}></View>
      </View>
    );
  };
  return renderStats();
};

export default WorkoutsStats;
