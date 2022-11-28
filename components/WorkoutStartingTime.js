import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { React, useState } from "react";
import * as appStyle from "./AppStyleSheet";
import DateTimePicker from "@react-native-community/datetimepicker";
const WorkoutStartingTime = (props) => {
  const now = new Date();
  const getMaxDate = () => {
    const maximumDate = new Date();
    maximumDate.setDate(maximumDate.getDate() + 7);
    return maximumDate;
  };
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [dateChangedOnce, setDateChangedOnce] = useState(false);
  const [mode, setMode] = useState(null);
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    if (mode == "date") {
      setDate(currentDate);
      setDateChangedOnce(true);
      props.startingTimeChanged(null);
      setMode("time");
    }
    if (mode == "time") {
      if (
        !(
          date.getDate() == now.getDate() &&
          currentDate.getTime() < now.getTime()
        )
      ) {
        setDate(currentDate);
        props.startingTimeChanged(currentDate);
        setShow(false);
      }
    }
  };
  const showTrue = () => {
    if (Platform.OS === "android") {
      setShow(true);
      // for iOS, add a button that closes the picker
    }
  };

  const showDatepicker = () => {
    setMode("date");
    showTrue();
  };
  const timeString = () => {
    var day;
    var time;
    if (now.getDate() == date.getDate()) day = "Today";
    else if (now.getDate() + 1 == date.getDate()) day = "Tomorrow";
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
    <View className="flex-row justify-around">
      <TouchableOpacity
        style={styles.input}
        className="rounded px-3 h-10 justify-center w-5/12"
        onPress={showDatepicker}
      >
        {!dateChangedOnce && (
          <Text style={{ color: "#5f6b8b", textAlign: "center" }}>
            Choose a day
          </Text>
        )}
        {dateChangedOnce && (
          <Text style={{ color: appStyle.appDarkBlue, textAlign: "center" }}>
            {timeString()}
          </Text>
        )}
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          minimumDate={now}
          maximumDate={getMaxDate()}
          testID="dateTimePicker"
          value={date}
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
    backgroundColor: appStyle.appGray,
    height: 50,
    borderColor: appStyle.appLightBlue,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});
export default WorkoutStartingTime;
