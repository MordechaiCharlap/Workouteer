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
    const renderColumn = (index) => {
      return (
        <View className="self-end items-center">
          <View
            className="h-10 w-4"
            style={{ backgroundColor: appStyle.color_primary }}
          ></View>
          <Text
            className="text-center"
            style={{ fontSize: 10, color: appStyle.color_primary }}
          >
            {weekdays[index]}
          </Text>
        </View>
      );
    };
    return (
      <View className="flex-row-reverse justify-around h-40">
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
