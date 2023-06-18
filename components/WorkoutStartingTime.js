import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { React, useEffect, useRef, useState } from "react";
import * as appStyle from "../utilities/appStyleSheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import useAuth from "../hooks/useAuth";
import languageService from "../services/languageService";
import { timeString } from "../services/timeFunctions";
import AwesomeAlert from "react-native-awesome-alerts";
import AwesomeModal from "./AwesomeModal";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCalendar,
  faCalendarDay,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import appComponentsDefaultStyles from "../utilities/appComponentsDefaultStyles";
import CustomText from "./basic/CustomText";
import CustomButton from "./basic/CustomButton";

const WorkoutStartingTime = (props) => {
  const { user } = useAuth();
  const [maxDate, setMaxDate] = useState();
  const [date, setDate] = useState(null);
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
  const getMinDate = () => {
    const now = new Date();
    const nowMinutes = now.getMinutes();
    const minutesToAdd = 15 - (nowMinutes % 15);

    now.setMinutes(now.getMinutes() + minutesToAdd);
    now.setSeconds(0);
    now.setMilliseconds(0);
    if (now) return now;
  };
  const minDate = useRef(getMinDate());

  const onDateChange = (event, selectedDate) => {
    const currentDate = new Date(selectedDate);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);
    if (event.type == "set") {
      if (mode == "date") {
        setDate(currentDate);
        setDateChangedOnce(false);
        props.startingTimeChanged(null);
        setMode("time");
      } else {
        //mode=time
        setShow(false);
        setMode("date");
        if (currentDate < minDate.current) {
          setShowAlert(true);
          setDateChangedOnce(false);
          setDate();
          props.startingTimeChanged(null);
        } else {
          setDateChangedOnce(true);
          setDate(currentDate);
          props.startingTimeChanged(currentDate);
        }
      }
    } else if (event.type == "dismissed") {
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
    <View
      className={`flex-1 items-center ${
        user.language == "hebrew" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <FontAwesomeIcon
        icon={faCalendarDays}
        size={30}
        color={appStyle.color_on_background}
      />
      <View style={{ width: 10 }}></View>
      <CustomButton
        style={
          date && dateChangedOnce
            ? {
                ...appComponentsDefaultStyles.input,
                flex: 1,
              }
            : {
                ...appComponentsDefaultStyles.errorInput,
                flex: 1,
              }
        }
        onPress={showDatepicker}
      >
        {!date || !dateChangedOnce ? (
          <CustomText style={appComponentsDefaultStyles.textOnInput}>
            {languageService[user.language].when}
          </CustomText>
        ) : (
          <CustomText style={appComponentsDefaultStyles.textOnInput}>
            {timeString(date, user.language)}
          </CustomText>
        )}
      </CustomButton>
      {show && (
        <DateTimePicker
          minimumDate={minDate.current}
          maximumDate={maxDate}
          testID="dateTimePicker"
          value={date || minDate.current}
          mode={mode}
          is24Hour={true}
          minuteInterval={15}
          onChange={onDateChange}
        />
      )}
      <AwesomeModal
        showModal={showAlert}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={true}
        onDismiss={() => {
          setShowAlert(false);
        }}
        closeOnHardwareBackPress={true}
        showConfirmButton={true}
        confirmText={languageService[user.language].gotIt}
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  changedVal: {
    backgroundColor: appStyle.color_primary,
  },
  notChangedVal: {
    backgroundColor: appStyle.color_background_variant,
  },
});
export default WorkoutStartingTime;
