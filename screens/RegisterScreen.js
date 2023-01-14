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

import { useNavigation } from "@react-navigation/native";
import responsiveStyle from "../components/ResponsiveStyling";
import { ResponsiveShadow } from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import * as defaultValues from "../services/defaultValues";
import usePushNotifications from "../hooks/usePushNotifications";
import useAuth from "../hooks/useAuth";
import SexDropdown from "../components/register/SexDropdown";
import BirthdayDatePicker from "../components/register/BirthdayDatePicker";
import BirthdayWebInput from "../components/register/BirthdayWebInput";
import EmailInput from "../components/register/EmailInput";
import UsernameInput from "../components/register/UsernameInput";
import Password from "../components/register/Password";
import ConfirmPassword from "../components/register/ConfirmPassword";
import TermsAndConditionsCB from "../components/register/TermsAndConditionsCB";
const RegisterScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const { googleUserInfo, setUser } = useAuth();
  const { pushToken } = usePushNotifications();
  const [isMale, setIsMale] = useState();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [inputErrorText, setInputErrorText] = useState();
  //Datepicker state
  const [date, setDate] = useState(new Date());
  //loading state
  const [loading, setLoading] = useState(false);

  const createAccountClicked = () => {};

  const handleLogin = async () => {
    const newUserData = {
      img: defaultValues.defaultProfilePic,
      username: username,
      displayName: username,
      id: username.toLowerCase(),
      birthdate: date,
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
        style={{
          backgroundColor: appStyle.color_primary,
          shadowColor: "#000",
        }}
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
        <View>
          {!googleUserInfo && (
            <View style={style.inputContainer}>
              <EmailInput style={style} valueChanged={setEmail} />
            </View>
          )}
          <View style={style.inputContainer}>
            <UsernameInput style={style} valueChanged={setUsername} />
          </View>

          <View style={style.inputContainer}>
            {Platform.OS != "web" ? (
              <BirthdayDatePicker style={style} valueChanged={setDate} />
            ) : (
              <BirthdayWebInput style={style} valueChanged={setDate} />
            )}
          </View>
          <View style={style.inputContainer}>
            <SexDropdown style={style} valueChanged={setIsMale} />
          </View>
          {!googleUserInfo && (
            <View>
              <View style={style.inputContainer}>
                <Password style={style} valueChanged={setPassword} />
              </View>
              <View className="bg-white" style={style.inputContainer}>
                <ConfirmPassword
                  style={style}
                  valueChanged={setConfirmPassword}
                  password={password}
                />
              </View>
            </View>
          )}
        </View>
        <View>
          <View style={style.inputContainer}>
            <TermsAndConditionsCB valueChanged={setAcceptTerms} />
          </View>
          {/* <Text
              className="text-center mt-4 mb-2"
              style={{
                color: appStyle.color_on_primary,
              }}
            >
              {inputErrorText}
            </Text> */}
          <TouchableOpacity
            onPress={createAccountClicked}
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
  inputContainer: { marginBottom: 5 },
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
