import { View, StyleSheet } from "react-native";
import * as appStyle from "../utils/appStyleSheet";
import React, { useState, useEffect } from "react";
import { Dropdown } from "react-native-element-dropdown";
import languageService from "../services/languageService";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import appComponentsDefaultStyles from "../utils/appComponentsDefaultStyles";
import CustomText from "./basic/CustomText";
const NextWeekDropdown = (props) => {
  const [minDate, setMinDate] = useState(props.minDate);
  const now = props.now;
  const language = props.language;
  const [weekday, setWeekday] = useState(now);
  const [weekdays, setWeekdays] = useState();
  const [hour, setHour] = useState();
  const [hours, setHours] = useState();
  const [minute, setMinute] = useState();
  const [minutes, setMinutes] = useState();
  const setSelectedDateByStates = () => {
    const date = new Date(weekday);
    date.setHours(hour);
    date.setMinutes(minute);
    props.selectedDateChanged(date);
  };
  useEffect(() => {
    var minYear;
    var minMonth;
    var minDay;
    if (minDate != null) {
      minYear = minDate.getFullYear();
      minMonth = minDate.getMonth();
      minDay = minDate.getDate();
    }
    const currentDay = now.getDay();
    const weekdaysArr = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      if (
        minDate != null &&
        (minYear > today.getFullYear() ||
          (minYear == today.getFullYear() && minMonth > today.getMonth()) ||
          (minYear == today.getFullYear() &&
            minMonth == today.getMonth() &&
            minDay > today.getDate()))
      ) {
      } else {
        const num = (currentDay + i) % 7;
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const formattedDate = `${day}/${month}`;
        weekdaysArr.push({
          label:
            i == 0
              ? languageService[language].weekdays[num] +
                ` (${languageService[language].today})`
              : i == 1
              ? languageService[language].weekdays[num] +
                ` (${languageService[language].tomorrow})`
              : languageService[language].weekdays[num] + ` ${formattedDate}`,
          value: new Date(today),
        });
      }

      today.setDate(today.getDate() + 1);
    }

    setWeekdays(weekdaysArr);
    setWeekday(
      minDate ? weekdaysArr[weekdaysArr.length - 1].value : weekdaysArr[0].value
    );
  }, [minDate]);
  useEffect(() => {
    const isToday = minDate
      ? minDate.getDate() == weekday.getDate()
      : weekday.getDay() === now.getDay();
    // Get the current hour and minute
    const currentHour = minDate ? minDate.getHours() : now.getHours();
    const currentMinutes = minDate ? minDate.getMinutes() : now.getMinutes();
    setHour(currentHour);

    // Create an empty array to store the time intervals
    const hoursInterval = [];

    for (let hour = 0; hour < 24; hour++) {
      if (
        isToday &&
        (hour < currentHour || (hour == currentHour && currentMinutes >= 45))
      ) {
        continue;
      }
      hoursInterval.push({
        label: hour.toString().padStart(2, "0"),
        value: hour,
      });
    }
    setHours(hoursInterval);

    setHour(hoursInterval[0].value);
  }, [weekday]);
  useEffect(() => {
    const isToday = minDate
      ? minDate.getDate() == weekday.getDate()
      : weekday.getDay() === now.getDay();
    const minutesInterval = [];
    const currentMinutes = minDate ? minDate.getMinutes() : now.getMinutes();
    const currentHour = minDate ? minDate.getHours() : now.getHours();
    for (let minute = 0; minute < 60; minute += 15) {
      if (isToday && hour == currentHour && currentMinutes >= minute) {
        continue;
      }
      minutesInterval.push({
        label: minute.toString().padStart(2, "0"),
        value: minute,
      });
    }
    setMinutes(minutesInterval);
    setMinute(minutesInterval[0].value);
  }, [hour]);
  useEffect(() => {
    setSelectedDateByStates();
  }, [weekday, hour, minute]);
  return (
    weekdays != null &&
    hours != null &&
    minutes != null && (
      <View>
        <View
          className={`items-center flex-row${
            language == "hebrew" ? "-reverse" : ""
          }`}
        >
          <FontAwesomeIcon
            icon={faCalendarDays}
            size={30}
            color={props.color || appStyle.color_primary}
          />
          <View style={{ width: 10 }}></View>
          <View style={{ flex: 1 }}>
            <Dropdown
              style={[
                weekday != null
                  ? appComponentsDefaultStyles.dropDown
                  : appComponentsDefaultStyles.errorDropDown,
                ,
              ]}
              placeholder={languageService[language].day}
              placeholderStyle={appComponentsDefaultStyles.inputPlaceHolder}
              selectedTextStyle={appComponentsDefaultStyles.inputText}
              iconStyle={style.iconStyle}
              data={weekdays}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={weekdays[0]}
              onChange={(item) => {
                setWeekday(item.value);
              }}
            />
            <View style={{ height: 10 }} />
            <View className="flex-row items-center">
              <Dropdown
                style={[
                  hour != null
                    ? appComponentsDefaultStyles.dropDown
                    : appComponentsDefaultStyles.errorDropDown,
                  ,
                  { width: 80 },
                ]}
                placeholder={languageService[language].hour}
                placeholderStyle={appComponentsDefaultStyles.inputPlaceHolder}
                selectedTextStyle={appComponentsDefaultStyles.inputText}
                iconStyle={style.iconStyle}
                data={hours}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={hour}
                onChange={(item) => {
                  setHour(item.value);
                }}
              />
              <CustomText style={{ fontSize: 30 }}>:</CustomText>
              <Dropdown
                style={[
                  minute != null
                    ? appComponentsDefaultStyles.dropDown
                    : appComponentsDefaultStyles.errorDropDown,
                  { width: 80 },
                ]}
                placeholder={languageService[language].minutes}
                placeholderStyle={appComponentsDefaultStyles.inputPlaceHolder}
                selectedTextStyle={appComponentsDefaultStyles.inputText}
                iconStyle={style.iconStyle}
                data={minutes}
                maxHeight={150}
                labelField="label"
                valueField="value"
                value={minute}
                onChange={(item) => {
                  setMinute(item.value);
                }}
              />
            </View>
          </View>
          <View style={{ height: 10 }} />
        </View>
      </View>
    )
  );
};
const style = StyleSheet.create({
  text: { color: appStyle.color_on_primary },
  container: {
    paddingHorizontal: 16,
  },
  dropdown: {
    height: 50,
    borderColor: appStyle.color_background_variant,
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
    color: "white",
  },
  placeholderStyle: {
    color: "#5f6b8b",
    fontSize: 16,
  },
  selectedTextStyle: {
    textAlign: "center",
    color: appStyle.color_on_primary,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default NextWeekDropdown;
