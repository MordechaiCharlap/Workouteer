import { View, Text } from "react-native";
import React, { useState } from "react";
import * as appStyle from "../../AppStyleSheet";
import languageService from "../../../services/languageService";
import useAuth from "../../../hooks/useAuth";
const WorkoutsStats = (props) => {
  const { user } = useAuth();
  const week = [];
  const weekdays = languageService[user.language].weekDays;
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
    const renderColumn = (index) => {
      return (
        <View className="self-end items-center">
          <Text
            className="text-center"
            style={{ fontSize: 10, color: appStyle.color_primary }}
          >
            {weekWorkoutMinutes[week[index].dayIndex]}
          </Text>
          <View
            className="w-4"
            style={{
              backgroundColor: appStyle.color_primary,
              height: pointHeight * weekWorkoutMinutes[week[index].dayIndex],
            }}
          ></View>
          <View
            className="w-4"
            style={{
              backgroundColor: appStyle.color_primary,
              height: 5,
            }}
          ></View>

          <Text
            className="text-center"
            style={{
              fontSize: 10,
              color: appStyle.color_primary,
              height: 15,
            }}
          >
            {week[index].dayName}
          </Text>
        </View>
      );
    };
    return (
      <View style={{ height: 180 }}>
        <View
          className="rounded-xl"
          style={{
            borderWidth: 1,
            borderColor: appStyle.color_primary,
          }}
        >
          <Text
            className="text-center"
            style={{
              color: appStyle.color_primary,
            }}
          >
            {languageService[user.language].weeklyStatisticsChart}
          </Text>
          <View
            className={`justify-between rounded px-2 ${
              user.language == "hebrew" ? "flex-row" : "flex-row-reverse"
            }`}
            style={{
              height: 160,
            }}
          >
            {/* <View
              className="absolute bottom-0 right-0 left-0 flex-row items-center gap-x-1 px-1 mx-1"
              style={{
                height: 140,
                borderColor: appStyle.color_primary,
                borderTopWidth: 0.5,
              }}
            >
              <Text
                className="absolute top-0 right-0"
                style={{ fontSize: 10, color: appStyle.color_primary }}
              >
                {highestPoints}
              </Text>
            </View> */}
            {renderColumn(0)}
            {renderColumn(1)}
            {renderColumn(2)}
            {renderColumn(3)}
            {renderColumn(4)}
            {renderColumn(5)}
            {renderColumn(6)}
          </View>
        </View>
      </View>
    );
  };
  return <View className="h-32 rounded">{renderStats()}</View>;
};

export default WorkoutsStats;
