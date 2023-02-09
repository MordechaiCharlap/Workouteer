import { View, Text } from "react-native";
import React, { useState } from "react";
import * as appStyle from "../../AppStyleSheet";
import { isSameDay } from "../../../services/timeFunctions";
const WorkoutsStats = (props) => {
  const week = [];
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
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 6);
    weekAgo.setHours(0, 0, 0, 0);
    for (var i = 0; i < 7; i++) {
      var tempDate = new Date();
      tempDate.setDate(tempDate.getDate() - i);
      week.push({
        dayName: weekdays[tempDate.getDay()],
        dayIndex: tempDate.getDay(),
      });
    }
    const weekWorkoutMinutes = [0, 0, 0, 0, 0, 0, 0];
    var highestPoints = 0;
    for (var workout of Object.values(props.workouts)) {
      if (workout[0].toDate() >= weekAgo && workout[2] == true) {
        weekWorkoutMinutes[workout[0].toDate().getDay()] += workout[1];
        if (weekWorkoutMinutes[workout[0].toDate().getDay()] > highestPoints)
          highestPoints = weekWorkoutMinutes[workout[0].toDate().getDay()];
      }
    }
    const pointHeight = 120 / highestPoints;
    console.log(pointHeight);
    const renderColumn = (index) => {
      return (
        <View className="self-end items-center">
          <View
            className="w-4"
            style={{
              backgroundColor: appStyle.color_primary,
              height: pointHeight * weekWorkoutMinutes[week[index].dayIndex],
            }}
          ></View>
          <View
            className="h-1 w-4"
            style={{ backgroundColor: appStyle.color_primary }}
          ></View>

          <Text
            className="text-center"
            style={{ fontSize: 10, color: appStyle.color_primary }}
          >
            {week[index].dayName}
          </Text>
        </View>
      );
    };
    return (
      <View
        className="flex-row-reverse justify-around rounded"
        style={{
          height: 160,
          borderWidth: 1,
          borderColor: appStyle.color_primary,
        }}
      >
        <View
          className="absolute right-0 left-0 flex-row items-center gap-x-1 px-1"
          style={{ top: 10 }}
        >
          <View
            style={{
              backgroundColor: appStyle.color_primary_variant,
              height: 1,
              flexGrow: 1,
            }}
          />
          <Text>{highestPoints}</Text>
        </View>
        {renderColumn(0)}
        {renderColumn(1)}
        {renderColumn(2)}
        {renderColumn(3)}
        {renderColumn(4)}
        {renderColumn(5)}
        {renderColumn(6)}
      </View>
    );
  };
  return <View className="h-32 rounded">{renderStats()}</View>;
};

export default WorkoutsStats;
