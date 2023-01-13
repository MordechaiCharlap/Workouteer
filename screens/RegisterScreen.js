import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  Image,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { React, useLayoutEffect, useRef, useState } from "react";
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
const RegisterScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const { googleUserInfo } = useAuth();
  const { pushToken } = usePushNotifications();
  const [isMale, setIsMale] = useState(null);
  const [email, setEmail] = useState("");
  const [emailStyle, setEmailStyle] = useState(style.input);
  const [username, setUsername] = useState("");
  const [usernameStyle, setUsernameStyle] = useState(style.input);
  const [password, setPassword] = useState("");
  const [passwordStyle, setPasswordStyle] = useState(style.input);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordStyle, setConfirmPasswordStyle] = useState(style.input);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [inputErrorText, setInputErrorText] = useState("");
  //Datepicker state
  const [date, setDate] = useState(new Date());
  const [dateStyle, setDateStyle] = useState(style.input);
  const [show, setShow] = useState(false);
  const [changedOnce, setChangeOnce] = useState(false);
  //web date
  const [day, setDay] = useState();
  const [dayStyle, setDayStyle] = useState(style.input);
  const [month, setMonth] = useState();
  const [monthStyle, setMonthStyle] = useState(style.input);
  const [year, setYear] = useState();
  const [yearStyle, setYearStyle] = useState(style.input);
  //loading state
  const [loading, setLoading] = useState(false);
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setShow(false);
    setChangeOnce(true);
    const age = calculateAge(currentDate);
    if (age < 16) {
      console.log(age);
      if (Platform.OS != "web")
        alert("You need to be at least 16 to use this app");
      setDateStyle(style.badInput);
    } else {
      setDateStyle(style.input);
    }
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

  const showDatepicker = () => {
    setShow(true);
  };
  const handleCreateAccount = async () => {
    setInputErrorText("");
    if (isMale != null) {
      if (username.length >= 6) {
        if (isRegexUsername(username)) {
          if ((Platform.OS != "web" && changedOnce) || Platform.OS == "web") {
            var age;
            if (Platform.OS == "web") {
              if (checkWebDate()) {
                const dateToCheck = new Date(year, month - 1, day, 0, 0, 0, 0);
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
                    } else
                      setInputErrorText("Accept terms before going further");
                  } else setInputErrorText("Username isnt available");
                } else
                  setInputErrorText("You need to be at least 16 years old");
              } else {
                setInputErrorText("Fill out the date correctly (dd/mm/yyyy)");
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
        } else setInputErrorText("Username must be english characters/numbers");
      } else setInputErrorText("Username too small (6+ characters)");
    } else setInputErrorText("Choose sex");
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
  const emailLostFocus = () => {
    var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(validRegex)) {
      console.log("good email");
      setEmailStyle(style.input);
    } else {
      if (Platform.OS != "web") alert("Invalid email");
      setEmailStyle(style.badInput);
    }
  };
  const isRegexUsername = (text) => {
    var validRegex = /^[a-zA-Z0-9]{6,20}$/;
    if (text.match(validRegex)) {
      return true;
    } else return false;
  };
  const usernameLostFocus = () => {
    if (isRegexUsername(username)) {
      setUsernameStyle(style.input);
    } else {
      if (Platform.OS != "web")
        alert(
          "Invalid username, Only english letters/numbers, between 6-20 characters"
        );
      setUsernameStyle(style.badInput);
    }
  };
  const passwordLostFocus = () => {
    var validRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    if (password.match(validRegex)) {
      console.log("good password");
      setPasswordStyle(style.input);
    } else {
      if (Platform.OS != "web")
        alert(
          "Invalid password, should be 8-20 characters, at least one number and one letter"
        );
      setPasswordStyle(style.badInput);
    }
  };
  const confirmPasswordLostFocus = () => {
    if (confirmPassword == password) {
      console.log("confirm is good");
      setConfirmPasswordStyle(style.input);
    } else {
      if (Platform.OS != "web") alert("Doesn't match password");
      setConfirmPasswordStyle(style.badInput);
    }
  };
  const handleLogin = async (webDate) => {
    setLoading(true);
    const newUserData = {
      img: defaultValues.defaultProfilePic,
      username: username,
      displayName: username,
      id: username.toLowerCase(),
      birthdate: webDate ? webDate : date,
      email: email,
      pushToken: pushToken,
      isMale: isMale,
    };
    await firebase.createUser(newUserData);
    setUser(await firebase.getUserDataById(username.toLowerCase()));
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
              onBlur={emailLostFocus}
              className="justify-center"
              style={emailStyle}
              placeholder="Email"
              placeholderTextColor={"#5f6b8b"}
              onChangeText={(text) => setEmail(text)}
            ></TextInput>
            <TextInput
              onBlur={usernameLostFocus}
              className="justify-center"
              style={usernameStyle}
              placeholder="Username (Must be unique)"
              placeholderTextColor={"#5f6b8b"}
              onChangeText={(text) => setUsername(text)}
            ></TextInput>
            {Platform.OS != "web" ? (
              <View>
                <TouchableOpacity
                  className="justify-center"
                  style={dateStyle}
                  onPress={showDatepicker}
                >
                  {!changedOnce && (
                    <Text style={{ color: "#5f6b8b" }}>Birthdate</Text>
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
                  className="mb-3 text-xl font-semibold"
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
            <View>
              <Dropdown
                style={style.input}
                containerStyle={{
                  borderTopWidth: 0,
                  borderBottomWidth: 2,
                  borderRightWidth: 2,
                  borderLeftWidth: 2,
                  borderColor: appStyle.color_bg,
                }}
                itemContainerStyle={{
                  position: "relative",
                  paddingLeft: 10,
                  height: 40,
                }}
                itemTextStyle={{
                  position: "absolute",
                  fontSize: 16,
                }}
                selectedTextStyle={{ fontSize: 16 }}
                placeholderStyle={{ color: "#5f6b8b", fontSize: 16 }}
                dropdownPosition="bottom"
                placeholder="Sex"
                iconStyle={style.iconStyle}
                data={[
                  { label: "Male", value: true },
                  { label: "Female", value: false },
                ]}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={isMale}
                onChange={(item) => {
                  setIsMale(item.value);
                }}
              />
            </View>
            {!googleUserInfo && (
              <View>
                <TextInput
                  className="justify-center"
                  secureTextEntry={true}
                  style={passwordStyle}
                  placeholder="Password"
                  placeholderTextColor={"#5f6b8b"}
                  onChangeText={(text) => setPassword(text)}
                  onBlur={passwordLostFocus}
                ></TextInput>
                <TextInput
                  className="justify-center"
                  secureTextEntry={true}
                  style={confirmPasswordStyle}
                  placeholder="Confirm Password"
                  placeholderTextColor={"#5f6b8b"}
                  onChangeText={(text) => setConfirmPassword(text)}
                  onBlur={confirmPasswordLostFocus}
                ></TextInput>
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
              className={`flex-1 rounded p-2 justify-center ${ResponsiveShadow} mt-5`}
              style={{
                backgroundColor: appStyle.color_bg,
                shadowColor: appStyle.color_bg,
              }}
            >
              <Text
                className="text-center font-bold text-xl tracking-widest"
                style={{ color: appStyle.color_primary }}
              >
                {loading ? "Loading..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RegisterScreen;
const style = StyleSheet.create({
  input: {
    paddingLeft: 10,
    height: 40,
    borderWidth: 2,
    borderColor: appStyle.color_bg,
    color: appStyle.color_primary,
    backgroundColor: appStyle.color_on_primary,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  badInput: {
    paddingLeft: 10,
    height: 40,
    borderWidth: 2,
    borderColor: appStyle.color_error,
    color: appStyle.color_primary,
    backgroundColor: appStyle.color_on_primary,
    borderRadius: 5,
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  text: { color: appStyle.color_on_primary },
  icon: {
    marginRight: 5,
    color: "white",
  },
  label: {
    position: "absolute",
    color: "#ffffff",
    backgroundColor: appStyle.color_primary,
    left: 22,
    top: -10,
    zIndex: 999,
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
