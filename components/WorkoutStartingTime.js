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
import { useEffect } from "react";
const WorkoutStartingTime = (props) => {
  const getMaxDate = () => {
    const maximumDate = new Date();
    maximumDate.setDate(maximumDate.getDate() + 7);
    return maximumDate;
  };
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);
  const [dateChangedOnce, setDateChangedOnce] = useState(false);
  const [timeChangedOnce, setTimeChangedOnce] = useState(false);
  const [mode, setMode] = useState(null);
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    if (mode == "date") {
      setDate(currentDate);
      setDateChangedOnce(true);
    }
    if (mode == "time") {
      // if(date.getDate()==new Date().getDate())
      setTime(currentDate);
      setTimeChangedOnce(true);
    }
    setShow(false);
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
        {!dateChangedOnce && (
          <Text style={{ color: "#5f6b8b" }}>Choose a day</Text>
        )}
        {dateChangedOnce && (
          <Text style={{ color: "#5f6b8b" }}>{date.toDateString()}</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.input}
        className="rounded mb-5 px-3 h-10 justify-center"
        onPress={showTimepicker}
      >
        {!timeChangedOnce && (
          <Text style={{ color: "#5f6b8b" }}>Choose a time</Text>
        )}
        {timeChangedOnce && (
          <Text style={{ color: "#5f6b8b" }}>{time.toLocaleTimeString()}</Text>
        )}
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          minimumDate={new Date()}
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
