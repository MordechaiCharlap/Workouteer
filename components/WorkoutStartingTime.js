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
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);
  const [changedOnce, setChangeOnce] = useState(false);
  const [mode, setMode] = useState(null);
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    if (mode == "date") setDate(currentDate);
    if (mode == "time") setTime(currentDate);
    console.log(selectedDate);
    setShow(false);
    setChangeOnce(true);
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

  const showTimepicker = () => {
    setMode("time");
    showTrue();
  };
  return (
    <View className="flex-row justify-between">
      <TouchableOpacity
        style={styles.input}
        className="rounded mb-5 px-3 h-10 justify-center"
        onPress={showDatepicker}
      >
        {!changedOnce && <Text style={{ color: "#5f6b8b" }}>Choose a day</Text>}
        {changedOnce && (
          <Text style={{ color: "#5f6b8b" }}>{date.toDateString()}</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.input}
        className="rounded mb-5 px-3 h-10 justify-center"
        onPress={showTimepicker}
      >
        {!changedOnce && (
          <Text style={{ color: "#5f6b8b" }}>Choose a time</Text>
        )}
        {changedOnce && (
          <Text style={{ color: "#5f6b8b" }}>{time.toTimeString()}</Text>
        )}
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
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
