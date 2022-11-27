import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import * as appStyle from "../components/AppStyleSheet";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
import { workoutTypes } from "../components/WorkoutType";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStopwatch, faUserGroup } from "@fortawesome/free-solid-svg-icons";
const WorkoutComponent = (props) => {
  const timeString = (date) => {
    var day;
    var time;
    if (props.now.getDate() == date.getDate()) day = "Today";
    else if (props.now.getDate() + 1 == date.getDate()) day = "Tomorrow";
    else {
      const dd = date.getDate();
      const mm = date.getMonth() + 1;
      day = dd + "/" + mm;
    }
    const hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const mm =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    time = hh + ":" + mm;
    return day + ", " + time;
  };
  return (
    <View
      className="rounded h-32 mb-5"
      style={{
        backgroundColor: appStyle.appLightBlue,
      }}
    >
      <View
        className="flex-row justify-between px-2"
        style={{
          borderBottomColor: appStyle.appDarkBlue,
          borderBottomWidth: 2,
        }}
      >
        <Text
          className="text-xl rounded-t"
          style={{
            color: appStyle.appDarkBlue,
          }}
        >
          {timeString(props.workout.startingTime.toDate())}
        </Text>
        <Text
          className="text-xl rounded-t"
          style={{
            color: appStyle.appDarkBlue,
          }}
        >
          {props.workout.creator == user.usernameLower
            ? "Your "
            : props.workout.creator + "'s"}
          workout
        </Text>
      </View>

      <View className="flex-row flex-1">
        <View
          className="justify-around items-center aspect-square"
          style={{
            borderRightColor: appStyle.appDarkBlue,
            borderRightWidth: 2,
          }}
        >
          <FontAwesomeIcon
            icon={workoutTypesArray[props.workout.type - 1].icon}
            size={60}
            color={appStyle.appDarkBlue}
          />
        </View>
        <View className="px-2 justify-evenly">
          <View className="flex-row items-center">
            <FontAwesomeIcon
              icon={faStopwatch}
              size={30}
              color={appStyle.appDarkBlue}
            />
            <Text
              className="text-md"
              style={{
                color: appStyle.appDarkBlue,
              }}
            >
              : {props.workout.minutes} minutes
            </Text>
          </View>
          <View className="flex-row items-center">
            <FontAwesomeIcon
              icon={faUserGroup}
              size={30}
              color={appStyle.appDarkBlue}
            />
            <Text
              className="text-md"
              style={{
                color: appStyle.appDarkBlue,
              }}
            >
              : {new Map(Object.entries(props.workout.members)).size}
            </Text>
          </View>
        </View>
        <View className="justify-around flex-1">
          <TouchableOpacity
            className="mx-2 h-8 justify-center rounded"
            style={{
              backgroundColor: appStyle.appDarkBlue,
            }}
          >
            <Text
              className="text-center"
              style={{
                color: appStyle.appGray,
              }}
            >
              More details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WorkoutComponent;
