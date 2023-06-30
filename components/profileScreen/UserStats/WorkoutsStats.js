import { View, Text } from "react-native";
import React, { useState } from "react";
import * as appStyle from "../../../utils/appStyleSheet";
import languageService from "../../../services/languageService";
import useAuth from "../../../hooks/useAuth";
import useConfirmedWorkouts from "../../../hooks/useConfirmedWorkouts";
import { useEffect } from "react";
import CustomText from "../../basic/CustomText";
const WorkoutsStats = ({ shownUser, color, backgroundColor }) => {
  const { user } = useAuth();
  const { getConfirmedWorkoutsByUserId, confirmedWorkouts } =
    useConfirmedWorkouts();
  const [confirmedWorkoutsArray, setConfirmedWorkoutsArray] = useState(
    user.id == shownUser.id ? confirmedWorkouts : []
  );
  useEffect(() => {
    if (user.id == shownUser.id) return;
    const getShownUserConfirmedWorkouts = async () => {
      setConfirmedWorkoutsArray(
        await getConfirmedWorkoutsByUserId(shownUser.id)
      );
    };
    getShownUserConfirmedWorkouts();
  }, []);
  const week = [];
  const weekdays = languageService[user.language].weekdays;
  const renderStats = () => {
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
    if (shownUser.workoutsCount != 0 && confirmedWorkoutsArray.length != 0)
      for (var i = shownUser.workoutsCount - 1; i >= 0; i--) {
        const workout = confirmedWorkoutsArray[i];
        if (workout.startingTime.toDate() < weekAgo) break;

        weekWorkoutMinutes[workout.startingTime.toDate().getDay()] +=
          workout.minutes;
        if (
          weekWorkoutMinutes[workout.startingTime.toDate().getDay()] >
          highestPoints
        )
          highestPoints =
            weekWorkoutMinutes[workout.startingTime.toDate().getDay()];
      }
    const pointHeight = highestPoints != 0 ? 120 / highestPoints : 0;
    const renderColumn = (index) => {
      return (
        <View className="self-end items-center">
          <CustomText
            className="text-center"
            style={{ fontSize: 10, color: color }}
          >
            {weekWorkoutMinutes[week[index].dayIndex]}
          </CustomText>
          <View
            className="w-4"
            style={{
              backgroundColor: color,
              height: pointHeight * weekWorkoutMinutes[week[index].dayIndex],
            }}
          ></View>
          <View
            className="w-4"
            style={{
              backgroundColor: color,
              height: 5,
            }}
          ></View>

          <Text
            className="text-center"
            style={{
              fontSize: 10,
              color: color,
              height: 15,
            }}
          >
            {week[index].dayName}
          </Text>
        </View>
      );
    };
    return (
      <View
        style={{
          backgroundColor: backgroundColor,
          borderRadius: 5,
          height: 200,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: 180,
          }}
        >
          <CustomText
            className="text-center"
            style={{
              color: color,
            }}
          >
            {languageService[user.language].weeklyStatisticsChart}
          </CustomText>
          <View
            className={`justify-between rounded px-2 ${
              user.language == "hebrew" ? "flex-row" : "flex-row-reverse"
            }`}
            style={{
              height: 160,
            }}
          >
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
