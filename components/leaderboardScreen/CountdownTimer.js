import { View, Text } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import languageService from "../../services/languageService";

const CountdownTimer = (props) => {
  const getNextSunday = () => {
    const today = new Date();
    const daysUntilSunday = 7 - today.getDay();
    const nextSunday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + daysUntilSunday
    );
    nextSunday.setHours(0, 0, 0, 0);
    return nextSunday;
  };
  const intervalRef = useRef(null);
  const dateRef = useRef(getNextSunday());
  const [secondsLeft, setSecondsLeft] = useState(
    Math.round((dateRef.current - new Date()) / 1000)
  );
  const formattedTimeLeft =
    secondsLeft > 0
      ? Math.floor(secondsLeft / 3600) > 24
        ? Math.floor(secondsLeft / 3600 / 24) +
          " " +
          languageService[props.language].days
        : Math.floor(secondsLeft / 3600) > 1
        ? Math.floor(secondsLeft / 3600) +
          " " +
          languageService[props.language].hours
        : Math.floor(secondsLeft % 60) > 1
        ? Math.floor(secondsLeft / 60) +
          " " +
          languageService[props.language].minutes
        : secondsLeft + " " + languageService[props.language].seconds
      : "Expired";

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prevSec) => prevSec - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);
  return (
    <View>
      <Text className="text-xl text-center font-semibold">
        {formattedTimeLeft}
      </Text>
    </View>
  );
};

export default CountdownTimer;
