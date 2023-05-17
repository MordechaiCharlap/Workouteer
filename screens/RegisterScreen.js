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
import { calculateAge } from "../utilities/calculateAge";
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
import CustomText from "../components/basic/CustomText";
import CustomTextInput from "../components/basic/CustomTextInput";
import CustomButton from "../components/basic/CustomButton";
const RegisterScreen = () => {
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
  const [birthdateError, setBirthdateError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [sexError, setSexError] = useState(false);
  const [termsCBError, setTermsCBError] = useState(false);
  //Datepicker state
  const [date, setDate] = useState(null);
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
      !date ||
      f(date && calculateAge(date.getDate()) < 16())
    ) {
      if (isMale == null) setSexError(true);
      else setSexError(false);
      if (!acceptTerms) setTermsCBError(true);
      else setTermsCBError(false);
      if (!date || (date && calculateAge(date.getDate()) < 16()))
        setBirthdateError(true);
      else setBirthdateError(false);
      setLoading(false);
      return false;
    } else {
      setInputErrorText(null);
      return true;
    }
  };
  useEffect(() => {
    if (emailError) setEmailError(false);
  }, [email]);
  useEffect(() => {
    if (usernameError) setUsernameError(false);
  }, [usernameError]);
  useEffect(() => {
    if (sexError) setSexError(false);
  }, [isMale]);
  const createAccountClicked = async () => {
    if (!loading) {
      setLoading(true);
      if (checkIfValidData())
        if (!googleUserInfo && !(await firebase.checkIfEmailAvailable(email))) {
          setInputErrorText("Email is already used");
          setEmailError(true);
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
    <View
      style={[
        safeAreaStyle(),
        { justifyContent: "center", marginHorizontal: 24 },
      ]}
    >
      <View
        className={`rounded-xl`}
        style={{
          padding: 12,
          backgroundColor: appStyle.color_surface,
          borderWidth: 1,
          borderColor: appStyle.color_outline,
        }}
      >
        <View className="items-center">
          <CustomText
            className="text-3xl tracking-widest"
            style={{ color: appStyle.color_on_surface }}
          >
            Register
          </CustomText>
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
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: 1, flexGrow: 1 }}>
                  <BirthdayDatePicker
                    style={style}
                    valueChanged={setDate}
                    error={birthdateError}
                  />
                </View>
                <View style={{ width: 10 }}></View>
                <View style={{ width: 1, flexGrow: 1 }}>
                  <SexDropdown
                    style={style}
                    valueChanged={setIsMale}
                    error={sexError}
                  />
                </View>
              </View>
            ) : (
              <>
                <BirthdayWebInput style={style} valueChanged={setDate} />
                <SexDropdown
                  style={style}
                  valueChanged={setIsMale}
                  error={sexError}
                />
              </>
            )}
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

        <CustomButton
          onPress={createAccountClicked}
          className={`flex-1 rounded-full p-2 justify-center mt-5`}
          style={{
            backgroundColor: appStyle.color_primary,
          }}
        >
          <CustomText
            className="text-center font-semibold text-xl tracking-widest"
            style={{ color: appStyle.color_on_primary }}
          >
            {loading ? "Loading" : "Create Account"}
          </CustomText>
        </CustomButton>
      </View>
      <Text
        className="text-center"
        style={{
          color: appStyle.color_error,
        }}
      >
        {inputErrorText}
      </Text>
    </View>
  );
};

export default RegisterScreen;
const style = StyleSheet.create({
  input: {
    borderRadius: 4,
    justifyContent: "center",
    paddingHorizontal: 10,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: appStyle.color_outline,
    backgroundColor: appStyle.color_surface_variant,
  },
  badInput: {
    borderRadius: 4,
    justifyContent: "center",
    paddingHorizontal: 10,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: appStyle.color_error,
    backgroundColor: appStyle.color_surface_variant,
  },

  inputError: {
    color: appStyle.color_error,
  },
  inputContainer: { marginBottom: 10 },
  text: { color: appStyle.color_on_surface_variant },
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
