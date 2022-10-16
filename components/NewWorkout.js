import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import WorkoutType from "./WorkoutType";
import WorkoutMinutes from "./WorkoutMinutes";
import WorkoutStartingTime from "./WorkoutStartingTime";
import WorkoutMaximumWaiting from "./WorkoutMaximumWaiting";
import WorkoutDescription from "./WorkoutDescription";
import * as appStyle from "./AppStyleSheet";
import WorkoutLocation from "./WorkoutLocation";
const NewWorkout = (props) => {
  const [type, setType] = useState(null);
  const [startingTime, setStartingTime] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [waitingTime, setWaitingTime] = useState(null);
  const [location, setLocation] = useState(null);
  const [desc, setDesc] = useState("");
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [nextButtonTextColor, setNextButtonTextColor] = useState("white");
  const [nextButtonColor, setNextButtonColor] = useState("black");

  useEffect(() => {
    checkIfCanAddWorkout();
  }, [type, startingTime, minutes, waitingTime]);
  const typeSelected = (id) => {
    setType(id);
  };

  const startingTimeSelected = (time) => {
    setStartingTime(time);
  };

  const minutesSelected = (minutes) => {
    setMinutes(minutes);
  };
  const waitingTimeSelected = (minutes) => {
    setWaitingTime(minutes);
  };

  const locationSelected = (id) => {
    setLocation(id);
  };
  const workoutAdded = () => {};
  const checkIfCanAddWorkout = () => {
    if (
      type != null &&
      startingTime != null &&
      minutes != null &&
      waitingTime != null
    ) {
      console.log("can add workout");
      setIsNextDisabled(false);
      setNextButtonTextColor(appStyle.appDarkBlue);
      setNextButtonColor("white");
    } else {
      console.log("cant add workout");
      setIsNextDisabled(true);
      setNextButtonTextColor("white");
      setNextButtonColor("black");
    }
  };
  return (
    <View className="flex-1">
      <ScrollView
        className={`rounded-xl content-center bottom-0 ${props.display}`}
        style={{
          backgroundColor: appStyle.appGray,
          opacity: props.opacity,
          width: "90%",
        }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="pt-4 pb-2 rounded mb-5">
          <WorkoutType typeSelected={typeSelected} />
        </View>
        <View className="pb-2 rounded mb-5">
          <WorkoutMinutes minutesSelected={minutesSelected} />
        </View>
        <View className="pb-2 rounded mb-5">
          <WorkoutStartingTime startingTimeSelected={startingTimeSelected} />
        </View>
        <View className="pb-2 rounded mb-5">
          <WorkoutMaximumWaiting waitingTimeSelected={waitingTimeSelected} />
        </View>
        <View className="pb-2 rounded mb-5">
          <WorkoutDescription descChanged={setDesc} />
        </View>
        {/* <View className="pb-2 rounded mb-5">
        <WorkoutLocation locationSelected={setLocation} />
      </View> */}
        <TouchableOpacity
          style={{
            marginHorizontal: "auto",
            marginBottom: 15,
            paddingHorizontal: 6,
            paddingVertical: 2,
            backgroundColor: nextButtonColor,
          }}
          disabled={isNextDisabled}
          className="rounded-lg shadow w-fit"
          onPress={workoutAdded}
        >
          <Text
            style={{
              color: nextButtonTextColor,
            }}
            className="text-center text-2xl font-semibold w-fit"
          >
            Next
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default NewWorkout;
