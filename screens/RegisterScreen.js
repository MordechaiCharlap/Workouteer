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
import { React, useLayoutEffect, useEffect, useState } from "react";

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
import LoadingAnimation from "../components/LoadingAnimation";
const RegisterScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const { googleUserInfo, loginLoading, createUserEmailAndPassword } =
    useAuth();
  const { pushToken } = usePushNotifications();
  const [isMale, setIsMale] = useState();
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [inputErrorText, setInputErrorText] = useState();
  const [sexError, setSexError] = useState(null);
  const [termsCBError, setTermsCBError] = useState(null);
  //Datepicker state
  const [date, setDate] = useState(new Date());
  //loading state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (acceptTerms) setTermsCBError(null);
  }, [acceptTerms]);
  const checkIfValidData = () => {
    if (
      isMale == null ||
      !acceptTerms ||
      !email ||
      !username ||
      !password ||
      !confirmPassword ||
      !date
    ) {
      setInputErrorText(
        "You have to fill all fields according to instructions"
      );
      if (isMale == null) setSexError("You have to choose gender");
      else setSexError(null);
      if (!acceptTerms)
        setTermsCBError("You have to agree in order to register");
      else setTermsCBError(null);

      setLoading(false);
      return false;
    } else {
      setInputErrorText(null);
      return true;
    }
  };
  const createAccountClicked = async () => {
    setLoading(true);
    if (checkIfValidData())
      if (!(await firebase.checkIfEmailAvailable(email))) {
        setInputErrorText("Email is already used");
        setLoading(false);
      } else if (
        !(await firebase.checkIfUsernameAvailable(username.toLowerCase()))
      ) {
        setInputErrorText("Username is taken");
        setLoading(false);
      } else await handleRegister();
  };

  const handleRegister = async () => {
    const newUserData = {
      img: defaultValues.defaultProfilePic,
      displayName: username,
      id: username.toLowerCase(),
      birthdate: date,
      email: email.toLowerCase(),
      pushToken: pushToken,
      isMale: isMale,
    };
    await firebase.createUser(newUserData);
    createUserEmailAndPassword(email, password);
  };

  return (
    <View className="justify-center" style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      {loginLoading ? (
        <LoadingAnimation />
      ) : (
        <>
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
            {!googleUserInfo && (
              <EmailInput style={style} valueChanged={setEmail} />
            )}
            <UsernameInput style={style} valueChanged={setUsername} />
            {Platform.OS != "web" ? (
              <BirthdayDatePicker style={style} valueChanged={setDate} />
            ) : (
              <BirthdayWebInput style={style} valueChanged={setDate} />
            )}
            <SexDropdown
              style={style}
              valueChanged={setIsMale}
              error={sexError}
            />
            {!googleUserInfo && (
              <>
                <Password style={style} valueChanged={setPassword} />
                <ConfirmPassword
                  style={style}
                  valueChanged={setConfirmPassword}
                  password={password}
                />
              </>
            )}
            <TermsAndConditionsCB
              style={style}
              valueChanged={setAcceptTerms}
              setError={setTermsCBError}
              error={termsCBError}
            />

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
            <Text
              className="text-center"
              style={{
                color: appStyle.color_error,
              }}
            >
              {inputErrorText}
            </Text>
          </View>
        </>
      )}
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
    justifyContent: "center",
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
    justifyContent: "center",
  },
  inputError: {
    color: appStyle.color_on_primary,
  },
  inputContainer: { marginBottom: 10 },
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
