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
const WorkoutStartingTime = (props) => {
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
          if (Platform.OS != "web") Alert.alert("cant go back in time");
          setDateChangedOnce(false);
          props.startingTimeChanged(null);
        } else {
          setDateChangedOnce(true);
          setDate(currentDate);
          props.startingTimeChanged(currentDate);
        }
        setShow(false);
        setMode("date");
      }
    } else if (event.type == "dismissed" && !dateChangedOnce) {
      console.log("dismissed in the middle");
      props.startingTimeChanged(null);
      setDate(null);
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
  const timeString = () => {
    var day;
    var time;
    if (props.minDate.getDate() == date.getDate()) day = "Today";
    else if (props.minDate.getDate() + 1 == date.getDate()) day = "Tomorrow";
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
    <View>
      <TouchableOpacity
        style={styles.input}
        className="rounded px-3 h-10 justify-center items-center"
        onPress={showDatepicker}
      >
        {!dateChangedOnce && (
          <Text style={{ color: appStyle.color_on_primary }}>When?</Text>
        )}
        {dateChangedOnce && (
          <Text
            style={{ color: appStyle.color_on_primary, textAlign: "center" }}
          >
            {timeString()}
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
