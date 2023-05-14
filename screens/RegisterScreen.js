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
  KeyboardAvoidingView,
} from "react-native";
import { React, useCallback, useEffect, useState } from "react";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as appStyle from "../utilities/appStyleSheet";
import * as firebase from "../services/firebase";
import usePushNotifications from "../hooks/usePushNotifications";
import useAuth from "../hooks/useAuth";
import SexDropdown from "../components/registerScreen/SexDropdown";
import BirthdayDatePicker from "../components/registerScreen/BirthdayDatePicker";
import BirthdayWebInput from "../components/registerScreen/BirthdayWebInput";
import EmailInput from "../components/registerScreen/EmailInput";
import UsernameInput from "../components/registerScreen/UsernameInput";
import Password from "../components/registerScreen/Password";
import ConfirmPassword from "../components/registerScreen/ConfirmPassword";
import TermsAndConditionsCB from "../components/registerScreen/TermsAndConditionsCB";
import LoadingAnimation from "../components/LoadingAnimation";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
const RegisterScreen = () => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();

  const {
    googleUserInfo,
    startListenToUserAsync,
    loginLoading,
    createUserEmailAndPassword,
  } = useAuth();
  const { pushToken } = usePushNotifications();
  const [isMale, setIsMale] = useState();
  const [email, setEmail] = useState(
    googleUserInfo ? googleUserInfo.email : null
  );
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
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Register");
    }, [])
  );
  useEffect(() => {
    if (acceptTerms) setTermsCBError(null);
  }, [acceptTerms]);
  const checkIfValidData = () => {
    if (
      isMale == null ||
      !acceptTerms ||
      !email ||
      !username ||
      (!googleUserInfo && !password) ||
      (!googleUserInfo && !confirmPassword) ||
      !date
    ) {
      setInputErrorText("You have to fill all fields correctly");
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
    if (!loading) {
      setLoading(true);
      if (checkIfValidData())
        if (!googleUserInfo && !(await firebase.checkIfEmailAvailable(email))) {
          setInputErrorText("Email is already used");
          setLoading(false);
        } else if (
          !(await firebase.checkIfUsernameAvailable(username.toLowerCase()))
        ) {
          setInputErrorText("Username is taken");
          setLoading(false);
        } else await handleRegister();
    }
  };

  const handleRegister = async () => {
    const uid = googleUserInfo
      ? googleUserInfo.uid
      : await createUserEmailAndPassword(email, password);
    const newUserData = {
      displayName: username,
      id: username.toLowerCase(),
      birthdate: date,
      email: email.toLowerCase(),
      pushToken: pushToken ? pushToken : null,
      isMale: isMale,
      uid: uid,
      authEmail: googleUserInfo ? false : true,
      authGoogle: googleUserInfo ? true : false,
    };
    await firebase.createUser(newUserData);
    await startListenToUserAsync(newUserData.id);
  };

  return (
    <View style={safeAreaStyle()} className="justify-center">
      {loginLoading ? (
        <LoadingAnimation />
      ) : (
        <View
          className={`mx-6 rounded-xl p-4`}
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
          <KeyboardAvoidingView
            behavior={Platform.OS == "android" ? "padding" : "padding"}
            enabled={true}
          >
            <ScrollView>
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
            </ScrollView>
          </KeyboardAvoidingView>
          <TermsAndConditionsCB
            style={style}
            valueChanged={setAcceptTerms}
            setError={setTermsCBError}
            error={termsCBError}
          />

          <TouchableOpacity
            onPress={createAccountClicked}
            className={`flex-1 rounded p-2 justify-center mt-5`}
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
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
});
