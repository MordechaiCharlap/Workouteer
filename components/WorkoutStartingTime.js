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
import AwesomeAlert from "react-native-awesome-alerts";

const WorkoutStartingTime = (props) => {
  const { user } = useAuth();
  const [maxDate, setMaxDate] = useState();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [dateChangedOnce, setDateChangedOnce] = useState(false);
  const [mode, setMode] = useState("date");
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState(
    languageService[user.language].cantGoBackInTime
  );
  const [alertMessage, setAlertMessage] = useState(
    languageService[user.language].scheduleLater[user.isMale ? 1 : 0]
  );
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
        setShow(false);
        setMode("date");
        if (
          date.getDate() == props.minDate.getDate() &&
          currentDate.getTime() < props.minDate.getTime()
        ) {
          setShowAlert(true);
          setDateChangedOnce(false);
          props.startingTimeChanged(null);
        } else {
          setDateChangedOnce(true);
          setDate(currentDate);
          props.startingTimeChanged(currentDate);
        }
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
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText={languageService[user.language].gotIt}
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          setShowAlert(false);
        }}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
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
