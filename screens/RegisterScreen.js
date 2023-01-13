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
import { React, useLayoutEffect, useRef, useState } from "react";
import CheckBox from "../components/CheckBox";
import { useNavigation } from "@react-navigation/native";
import responsiveStyle from "../components/ResponsiveStyling";
import { ResponsiveShadow } from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import * as defaultValues from "../services/defaultValues";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import usePushNotifications from "../hooks/usePushNotifications";
import useAuth from "../hooks/useAuth";
import SexDropdown from "../components/Register/sexDropdown";
import BirthdayDatePicker from "../components/Register/BirthdayDatePicker";
import BirthdayWebInput from "../components/Register/BirthdayWebInput";
import EmailInput from "../components/Register/EmailInput";
import UsernameInput from "../components/Register/UsernameInput";
import Password from "../components/Register/Password";
const RegisterScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const { googleUserInfo, setUser } = useAuth();
  const { pushToken } = usePushNotifications();
  const [isMale, setIsMale] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordStyle, setConfirmPasswordStyle] = useState(style.input);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [inputErrorText, setInputErrorText] = useState("");
  //Datepicker state
  const [date, setDate] = useState(new Date());

  //web date

  //loading state
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (!loading) {
      setLoading(true);
      setInputErrorText("");
      if (isMale != null) {
        if (username.length >= 6) {
          if (isRegexUsername(username)) {
            if ((Platform.OS != "web" && changedOnce) || Platform.OS == "web") {
              var age;
              if (Platform.OS == "web") {
                if (checkWebDate()) {
                  const dateToCheck = new Date(
                    year,
                    month - 1,
                    day,
                    0,
                    0,
                    0,
                    0
                  );
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
                    } else
                      setInputErrorText("Accept terms before going further");
                  } else setInputErrorText("Username isnt available");
                } else
                  setInputErrorText("You need to be at least 16 years old");
              }
            } else setInputErrorText("Choose birthdate");
          } else
            setInputErrorText("Username must be english characters/numbers");
        } else setInputErrorText("Username too small (6+ characters)");
      } else setInputErrorText("Choose sex");
      setLoading(false);
    }
  };
  const handleLogin = async (webDate) => {
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
            <EmailInput style={style} />
            <UsernameInput style={style} />
            {Platform.OS != "web" ? (
              <View className="mb-5">
                <BirthdayDatePicker style={style} />
              </View>
            ) : (
              <View className="items-center mb-5">
                <BirthdayWebInput style={style} />
              </View>
            )}
            <View className="mb-5">
              <SexDropdown style={style.input} valueChanged={setIsMale} />
            </View>
            {!googleUserInfo && (
              <View>
                <View className="mb-5">
                  <Password style={style} />
                </View>
                <TextInput
                  className="justify-center mb-5"
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
                {loading ? "Loading" : "Create Account"}
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
    borderRadius: 4,
    color: appStyle.color_primary,
    backgroundColor: appStyle.color_on_primary,
    paddingHorizontal: 5,
  },
  badInput: {
    paddingLeft: 10,
    height: 40,
    borderWidth: 2,
    borderColor: appStyle.color_error,
    color: appStyle.color_primary,
    backgroundColor: appStyle.color_on_primary,
    borderRadius: 4,
    paddingHorizontal: 5,
  },
  text: { color: appStyle.color_on_primary },
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
});
