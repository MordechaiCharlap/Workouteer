import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { React, useEffect, useState } from "react";
import * as appStyle from "./AppStyleSheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import useAuth from "../hooks/useAuth";
import languageService from "../services/languageService";
import { timeString } from "../services/timeFunctions";
import * as workoutUtils from "../utilities/workoutUtils";
const WorkoutStartingTime = (props) => {
  const { user } = useAuth();
  const [maxDate, setMaxDate] = useState();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [dateChangedOnce, setDateChangedOnce] = useState(false);
  const [mode, setMode] = useState("date");
  useEffect(() => {
    const maximumDate = new Date();
    maximumDate.setDate(maximumDate.getDate() + 7);
    setMaxDate(maximumDate);
  }, []);
  const checkIfDateAvailableAndReturnClosestWorkout = (dateToCheck) => {
    var closestWorkoutDate = null;
    for (var value of Object.values(user.workouts)) {
      if (
        new Date(value[0].toDate().getTime() + value[1] * 60000) >
          dateToCheck &&
        value[0].toDate() < dateToCheck
      ) {
        return false;
      } else if (
        value[0].toDate() > dateToCheck &&
        (closestWorkoutDate == null || closestWorkoutDate > value[0].toDate())
      )
        closestWorkoutDate = value[0].toDate();
    }
    return closestWorkoutDate;
  };
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    if (event.type == "set") {
      if (mode == "date") {
        setDate(currentDate);
        setMode("time");
      } else {
        if (
          date.getDate() == props.minDate.getDate() &&
          currentDate.getTime() < props.minDate.getTime()
        ) {
          if (Platform.OS != "web") Alert.alert("Can't go back in time");
          setDateChangedOnce(false);
          props.startingTimeChanged(null);
        } else {
          const closestWorkout =
            workoutUtils.checkIfDateAvailableAndReturnClosestWorkout(
              user,
              currentDate
            );
          if (closestWorkout == false) {
            if (Platform.OS != "web")
              Alert.alert("You already have a workout in this date");
            setDateChangedOnce(false);
            props.startingTimeChanged(null);
          } else {
            setDateChangedOnce(true);
            setDate(currentDate);
            props.startingTimeChanged(currentDate);
            if (props.setClosestWorkoutDate)
              props.setClosestWorkoutDate(closestWorkout);
          }
        }
        setShow(false);
        setMode("date");
      }
    } else if (event.type == "dismissed" && !dateChangedOnce) {
      props.startingTimeChanged(null);
      setDate(new Date());
      setShow(false);
      setMode("date");
    } else if (event.type == "dismissed" && dateChangedOnce) {
      setShow(false);
      setMode("date");
    }
  };
  const showTrue = () => {
    if (Platform.OS === "android") {
      setShow(true);
      // for iOS, add a button that closes the picker
    }
  };

  const showDatepicker = () => {
    showTrue();
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.input}
        className="rounded px-3 h-10 justify-center items-center"
        onPress={showDatepicker}
      >
        {!dateChangedOnce && (
          <Text style={{ color: appStyle.color_on_primary }}>
            {languageService[user.language].when}
          </Text>
        )}
        {dateChangedOnce && (
          <Text
            style={{ color: appStyle.color_on_primary, textAlign: "center" }}
          >
            {timeString(date, user.language)}
          </Text>
        )}
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          minimumDate={props.minDate}
          maximumDate={maxDate}
          testID="dateTimePicker"
          value={date ? date : new Date()}
          mode={mode}
          is24Hour={true}
          minuteInterval={15}
          onChange={onDateChange}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    width: 130,
    backgroundColor: appStyle.color_primary,
    height: 50,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});
export default WorkoutStartingTime;
