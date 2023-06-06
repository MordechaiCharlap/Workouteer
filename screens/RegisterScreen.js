import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  Image,
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
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
const RegisterScreen = () => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();

  const {
    googleUserInfo,
    createUserEmailAndPassword,
    signInWithCredentialGoogle,
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
      (date && calculateAge(date) < 16)
    ) {
      if (isMale == null) setSexError(true);
      else setSexError(false);
      if (!acceptTerms) setTermsCBError(true);
      else setTermsCBError(false);
      if (!date || (date && calculateAge(date) < 16)) setBirthdateError(true);
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
  useEffect(() => {
    const handleGoogleRegister = async () => {
      const newUserData = {
        displayName: username,
        id: username.toLowerCase(),
        birthdate: date,
        email: email.toLowerCase(),
        pushToken: pushToken ? pushToken : null,
        isMale: isMale,
        uid: googleUserInfo.uid,
        authEmail: googleUserInfo ? false : true,
        authGoogle: googleUserInfo ? true : false,
      };
      await firebase.createUser(newUserData);
    };
    if (googleUserInfo?.uid) {
      handleGoogleRegister();
    }
  }, [googleUserInfo?.uid]);
  const handleRegister = async () => {
    if (googleUserInfo) {
      signInWithCredentialGoogle();
      return;
    }
    const uid = await createUserEmailAndPassword(email, password);
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
    // await startListenToUserAsync(newUserData.id);
  };
  const verticalMargin = 10;
  return (
    <View
      style={[
        safeAreaStyle(),
        {
          justifyContent: "center",
          paddingHorizontal: 16,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="absolute left-0 top-0"
        style={{ padding: 16 }}
      >
        <FontAwesomeIcon
          icon={faChevronLeft}
          color={appStyle.color_on_background}
          size={25}
        />
      </TouchableOpacity>
      <View
        className={`rounded-xl`}
        style={{
          padding: 12,
          backgroundColor: appStyle.color_surface,
          borderWidth: 1,
          borderColor: appStyle.color_outline,
        }}
      >
        <CustomText
          className="text-3xl tracking-widest"
          style={{ color: appStyle.color_on_surface, textAlign: "center" }}
        >
          Register
        </CustomText>
        <View style={{ height: verticalMargin }} />
        <KeyboardAvoidingView
          behavior={Platform.OS == "android" ? "padding" : "padding"}
          enabled={true}
        >
          <ScrollView>
            {!googleUserInfo && (
              <EmailInput style={style} valueChanged={setEmail} />
            )}
            <View style={{ height: verticalMargin }} />
            <UsernameInput style={style} valueChanged={setUsername} />
            <View style={{ height: verticalMargin }} />
            {Platform.OS != "web" ? (
              <>
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
              </>
            ) : (
              <>
                <BirthdayWebInput style={style} valueChanged={setDate} />
                <View style={{ height: verticalMargin }} />
                <SexDropdown
                  style={style}
                  valueChanged={setIsMale}
                  error={sexError}
                />
              </>
            )}
            <View style={{ height: verticalMargin }} />
            {!googleUserInfo && (
              <>
                <Password style={style} valueChanged={setPassword} />
                <View style={{ height: verticalMargin }} />
                <ConfirmPassword
                  style={style}
                  valueChanged={setConfirmPassword}
                  password={password}
                />
                <View style={{ height: verticalMargin }} />
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
        <View style={{ height: verticalMargin }} />

        <CustomButton
          onPress={createAccountClicked}
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
