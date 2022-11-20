import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { React, useState } from "react";
import * as appStyle from "./AppStyleSheet";
import DateTimePicker from "@react-native-community/datetimepicker";
const WorkoutStartingTime = (props) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [changedOnce, setChangeOnce] = useState(false);
  const [mode, setMode] = useState(null);
  const onDateChange = (selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setShow(false);
    setChangeOnce(true);
    props.dateTimeChanged(selectedDate);
  };
  const showMode = (currentMode) => {
    if (Platform.OS === "android") {
      setShow(true);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };
  return (
    <View>
      <TouchableOpacity
        style={styles.input}
        className="rounded mb-5 px-3 h-10 justify-center"
        onPress={showDatepicker}
      >
        {!changedOnce && (
          <Text style={{ color: "#5f6b8b" }}>
            birthdate (works only on Android)
          </Text>
        )}
        {changedOnce && (
          <Text style={{ color: "#5f6b8b" }}>{date.toDateString()}</Text>
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
