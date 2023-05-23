import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { React, useCallback, useEffect, useState } from "react";
import CheckBox from "../components/CheckBox";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as appStyle from "../utilities/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import {
  faCircleUser,
  faEye,
  faGoogle,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
import LoadingAnimation from "../components/LoadingAnimation";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import CustomButton from "../components/basic/CustomButton";
import CustomText from "../components/basic/CustomText";
import CustomTextInput from "../components/basic/CustomTextInput";
const LoginScreen = () => {
  const windowHeight = useWindowDimensions().height;
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Login");
    }, [])
  );
  const navigation = useNavigation();
  const {
    signInEmailPassword,
    initialLoading,
    signInGoogleAccount,
    authErrorCode,
    loginLoading,
    setRememberMe,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const loginEmailPassword = async () => {
    if (!loginLoading) {
      setErrorText("");
      if (password == "" || email == "")
        setErrorText("You have to fill both fields");
      else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        setErrorText("Invalid-email");
      else if (!/^[a-zA-Z0-9]{6,20}$/.test(password))
        setErrorText("Invalid-password");
      else if (!loginLoading) await signInEmailPassword(email, password);
    }
  };

  useEffect(() => {
    if (!authErrorCode) return;
    switch (authErrorCode) {
      case "auth/wrong-password":
        setErrorText("Wrong password");
        break;
      case " auth/wrong-password":
        setErrorText("Wrong password");
        break;
      case "auth/invalid-email":
        setErrorText("Invalid-email");
        break;
      case " auth/invalid-email":
        setErrorText("Invalid-email");
        break;
      case "auth/user-not-found":
        setErrorText("User doesn't exists");
        break;
      case " auth/user-not-found":
        setErrorText("User doesn't exists");
        break;
      case "auth/too-many-requests":
        setErrorText("Too many tries, try again later");
        break;
      case " auth/too-many-requests":
        setErrorText("Too many tries, try again later");
        break;
      default:
        setErrorText("");
    }
  }, [authErrorCode]);
  const verticalMargin = 10;
  return (
    <View
      style={[
        safeAreaStyle(),
        { justifyContent: "center", marginHorizontal: 24 },
      ]}
    >
      <View>
        <View
          className={`rounded-t-xl`}
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: appStyle.color_outline,
          }}
        >
          <View className="items-center">
            <FontAwesomeIcon
              icon={faCircleUser}
              color={appStyle.color_primary}
              size={50}
            />
            <View style={{ height: verticalMargin }}></View>
            <CustomText
              style={{ color: appStyle.color_on_surface }}
              className="text-2xl"
            >
              {"Welcome :)"}
            </CustomText>
            <View style={{ height: verticalMargin }}></View>
            <CustomText style={{ color: appStyle.color_on_surface }}>
              Sign in and find a partner for your next workout TODAY!
            </CustomText>
            <View style={{ height: verticalMargin }}></View>
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS == "android" ? null : "padding"}
            enabled={true}
          >
            <ScrollView scrollEnabled={false}>
              <CustomTextInput
                style={{
                  backgroundColor: appStyle.color_surface_variant,
                }}
                onChangeText={setEmail}
                placeholder="Email"
              />
              <View style={{ height: verticalMargin }}></View>
              <CustomTextInput
                password={true}
                style={{
                  backgroundColor: appStyle.color_surface_variant,
                }}
                onChangeText={setPassword}
                placeholder="Password"
              />
              <View style={{ height: verticalMargin }}></View>
              <View className="flex-row items-center">
                <CheckBox
                  valueColor={appStyle.color_on_primary}
                  backgroundColor={appStyle.color_primary}
                  value={false}
                  onValueChange={(value) => setRememberMe(value)}
                />
                <CustomText
                  className="ml-2"
                  style={{ color: appStyle.color_primary }}
                >
                  Remember me!
                </CustomText>
              </View>
              <CustomText
                className="text-center h-8"
                style={{ color: appStyle.color_error, paddingVertical: 5 }}
              >
                {errorText}
              </CustomText>
            </ScrollView>
          </KeyboardAvoidingView>
          <CustomButton
            onPress={loginEmailPassword}
            style={{ backgroundColor: appStyle.color_primary }}
          >
            <CustomText
              className="text-center tracking-widest font-bold text-xl"
              style={{
                color: appStyle.color_on_primary,
              }}
            >
              {loginLoading == true ? "Loading" : "Login"}
            </CustomText>
          </CustomButton>
          <View style={{ height: verticalMargin }}></View>

          <CustomButton
            style={{
              borderWidth: 0.5,
              borderColor: appStyle.color_primary,
              backgroundColor: appStyle.color_surface,
            }}
            onPress={() => signInGoogleAccount()}
          >
            <View className="absolute left-1 h-full justify-center">
              {/* <AntDesign
                name="google"
                size={24}
                color={appStyle.color_primary}
              /> */}
            </View>
            <CustomText
              className="tracking-widest font-bold text-xl"
              style={{
                color: appStyle.color_primary,
              }}
            >
              Continue with Google
            </CustomText>
          </CustomButton>
        </View>
        <View style={{ height: verticalMargin }}></View>

        <CustomButton onPress={() => navigation.navigate("Register")}>
          <CustomText
            className="text-center tracking-widest"
            style={{ color: appStyle.color_on_background }}
          >
            New here? click here to register
          </CustomText>
        </CustomButton>
      </View>
    </View>
  );
};

export default LoginScreen;
const style = StyleSheet.create({
  input: {
    paddingLeft: 10,
    height: 40,
    borderWidth: 2,
    borderColor: appStyle.color_background,
    color: appStyle.color_primary,
    backgroundColor: appStyle.color_on_primary,
  },
});
