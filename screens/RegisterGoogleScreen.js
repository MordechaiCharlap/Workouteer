import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { React, useLayoutEffect, useState } from "react";
import CheckBox from "../components/CheckBox";
import { useNavigation } from "@react-navigation/native";
import responsiveStyle from "../components/ResponsiveStyling";
import { ResponsiveShadow } from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as defaultValues from "../services/defaultValues";
import usePushNotifications from "../hooks/usePushNotifications";
import useAuth from "../hooks/useAuth";
const RegisterGoogleScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const { pushToken } = usePushNotifications();
  const { googleUserInfo, setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [usernameStyle, setUsernameStyle] = useState(style.input);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [inputErrorText, setInputErrorText] = useState("");
  //Datepicker state
  const [date, setDate] = useState(new Date());

  const [dateStyle, setDateStyle] = useState(style.input);

  const [day, setDay] = useState();
  const [dayStyle, setDayStyle] = useState(style.input);
  const [month, setMonth] = useState();
  const [monthStyle, setMonthStyle] = useState(style.input);
  const [year, setYear] = useState();
  const [yearStyle, setYearStyle] = useState(style.input);
  const [show, setShow] = useState(false);
  const [changedOnce, setChangeOnce] = useState(false);
  const [loading, setLoading] = useState(false);
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setShow(false);
    setChangeOnce(true);
    const age = calculateAge(currentDate);
    if (age < 16) {
      console.log(age);
      setDateStyle(style.badInput);
    } else {
      setDateStyle(style.input);
    }
  };

  const showDatepicker = () => {
    setShow(true);
  };
  const checkWebDate = () => {
    if (
      day.length == 2 &&
      !isNaN(day) &&
      month.length == 2 &&
      !isNaN(month) &&
      year.length == 4 &&
      !isNaN(year)
    )
      return true;
    console.log("not a good web date");
    return false;
  };
  const handleCreateAccount = async () => {
    setInputErrorText("");
    if (username.length >= 6) {
      if ((Platform.OS != "web" && changedOnce) || Platform.OS == "web") {
        var age;
        if (Platform.OS == "web") {
          if (checkWebDate()) {
            const dateToCheck = new Date(year, month - 1, day, 0, 0, 0, 0);
            console.log(dateToCheck);
            age = calculateAge(dateToCheck);
            var isUserAvailable = await firebase.checkUsername(
              username.toLowerCase()
            );
            if (age >= 16) {
              setDate(dateToCheck);
              if (isUserAvailable) {
                if (acceptTerms) {
                  setInputErrorText("");
                  await handleLogin(dateToCheck);
                } else setInputErrorText("Accept terms before going further");
              } else setInputErrorText("Username isnt available");
            } else setInputErrorText("You need to be at least 16 years old");
          }
        } else {
          age = calculateAge(date);
          var isUserAvailable = await firebase.checkUsername(
            username.toLowerCase()
          );
          if (age >= 16) {
            if (isUserAvailable) {
              if (acceptTerms) {
                setInputErrorText("");
                await handleLogin();
              } else setInputErrorText("Accept terms before going further");
            } else setInputErrorText("Username isnt available");
          } else setInputErrorText("You need to be at least 16 years old");
        }
      } else setInputErrorText("Choose birthdate");
    } else setInputErrorText("Username too small (6+ characters)");
  };
  const calculateAge = (dateToCheck) => {
    var today = new Date();
    var age = today.getFullYear() - dateToCheck.getFullYear();
    var m = today.getMonth() - dateToCheck.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dateToCheck.getDate())) {
      age--;
    }
    console.log(age);
    return age;
  };

  const usernameLostFocus = () => {
    var validRegex = /^[a-zA-Z0-9]{6,20}$/;
    if (username.match(validRegex)) {
      console.log("good username");
      setUsernameStyle(style.input);
    } else {
      setUsernameStyle(style.badInput);
    }
  };
  const dayLostFocus = () => {
    var validRegex = /[0-9]{2}/;
    if (day.match(validRegex)) {
      setDayStyle(style.input);
    } else {
      setDayStyle(style.badInput);
    }
  };
  const monthLostFocus = () => {
    var validRegex = /[0-9]{2}/;
    if (month.match(validRegex)) {
      setMonthStyle(style.input);
    } else {
      setMonthStyle(style.badInput);
    }
  };
  const yearLostFocus = () => {
    var validRegex = /[0-9]{2}/;
    if (year.match(validRegex)) {
      setYearStyle(style.input);
    } else {
      setYearStyle(style.badInput);
    }
  };
  const handleLogin = async (webDate) => {
    var newUserData;
    if (Platform.OS == "web") {
      newUserData = {
        img: defaultValues.defaultProfilePic,
        username: username,
        displayName: username,
        id: username.toLowerCase(),
        birthdate: webDate,
        email: googleUserInfo.email.toLowerCase(),
        pushToken: pushToken,
      };
    } else {
      newUserData = {
        img: defaultValues.defaultProfilePic,
        username: username,
        displayName: username,
        id: username.toLowerCase(),
        birthdate: date,
        email: googleUserInfo.email.toLowerCase(),
        pushToken: pushToken,
      };
    }
    await firebase.createUser(newUserData);
    setLoading(true);
    setTimeout(() => {
      setUser(firebase.getUserDataById(username));
    }, 2000);
    setLoading(false);
  };
  return (
    <View className="justify-center" style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View
        className={`mx-6 rounded-xl p-4 ${ResponsiveShadow}`}
        style={{ backgroundColor: appStyle.color_primary, shadowColor: "#000" }}
      >
        <View className="mb-8 items-center">
          <View className="items-center">
            <Text
              className="text-3xl tracking-widest"
              style={{ color: appStyle.color_on_primary }}
            >
              Register
            </Text>
          </View>
        </View>
        <View className="flex-1 justify-between">
          <View>
            <TextInput
              onBlur={usernameLostFocus}
              className="rounded mb-5 px-3 h-10 justify-center"
              style={usernameStyle}
              placeholder="Username (Must be unique)"
              placeholderTextColor={"#5f6b8b"}
              onChangeText={(text) => setUsername(text)}
            ></TextInput>
            {Platform.OS == "android" ? (
              <View>
                <TouchableOpacity
                  className="rounded mb-5 px-3 h-10 justify-center"
                  style={dateStyle}
                  onPress={showDatepicker}
                >
                  {!changedOnce && (
                    <Text style={{ color: "#5f6b8b" }}>
                      birthdate (works only on Android)
                    </Text>
                  )}
                  {changedOnce && (
                    <Text style={{ color: "#5f6b8b" }}>
                      {date.toDateString()}
                    </Text>
                  )}
                </TouchableOpacity>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    onChange={onDateChange}
                  />
                )}
              </View>
            ) : (
              <View className="items-center">
                <Text
                  className="mr-2"
                  style={{ color: appStyle.color_on_primary }}
                >
                  Birthdate
                </Text>
                <View className="flex-row w-full items-center justify-between">
                  <TextInput
                    onBlur={(text) => dayLostFocus(text)}
                    maxLength={2}
                    className="text-center w-20"
                    placeholderTextColor={"#5f6b8b"}
                    placeholder="Day dd"
                    style={dayStyle}
                    onChangeText={(text) => setDay(text)}
                  ></TextInput>
                  <TextInput
                    onBlur={(text) => monthLostFocus(text)}
                    maxLength={2}
                    className="text-center w-20"
                    placeholderTextColor={"#5f6b8b"}
                    placeholder="Month mm"
                    style={monthStyle}
                    onChangeText={(text) => setMonth(text)}
                  ></TextInput>
                  <TextInput
                    onBlur={(text) => yearLostFocus(text)}
                    maxLength={4}
                    className="text-center w-20"
                    placeholderTextColor={"#5f6b8b"}
                    placeholder="Year yyyy"
                    style={yearStyle}
                    onChangeText={(text) => setYear(text)}
                  ></TextInput>
                </View>
              </View>
            )}
          </View>
          <View>
            <View className="flex-row items-center mb-5">
              <CheckBox
                backgroundColor={appStyle.color_on_primary}
                valueColor={appStyle.color_primary}
                value={false}
                onValueChange={setAcceptTerms}
              />
              <Text
                className="ml-2"
                style={{ color: appStyle.color_on_primary }}
              >
                {"I agree to the "}
              </Text>
              <Text
                className="font-semibold underline"
                style={{ color: appStyle.color_on_primary }}
              >
                Terms and Conditions
              </Text>
            </View>
            <Text
              className="text-center mt-4 mb-2"
              style={{
                color: appStyle.color_on_primary,
              }}
            >
              {inputErrorText}
            </Text>
            <TouchableOpacity
              onPress={handleCreateAccount}
              className={`flex-1 rounded p-2 justify-center ${ResponsiveShadow} mt-5 mb-10`}
              style={{
                backgroundColor: appStyle.color_bg,
                shadowColor: appStyle.color_bg,
              }}
            >
              <Text
                className="text-center font-bold text-xl tracking-widest"
                style={{ color: appStyle.color_primary }}
              >
                {loading ? "Loading" : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RegisterGoogleScreen;
const style = StyleSheet.create({
  input: {
    borderRadius: 4,
    height: 40,
    borderWidth: 2,
    borderColor: appStyle.color_bg,
    color: appStyle.color_primary,
    backgroundColor: appStyle.color_on_primary,
  },
  badInput: {
    paddingLeft: 10,
    height: 40,
    borderWidth: 2,
    borderColor: appStyle.color_error,
    color: appStyle.color_primary,
    backgroundColor: appStyle.color_on_primary,
  },
});
