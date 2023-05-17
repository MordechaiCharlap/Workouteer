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
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
import LoadingAnimation from "../components/LoadingAnimation";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import CustomButton from "../components/basic/CustomButton";
import CustomText from "../components/basic/CustomText";
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
  const [showPassword, setShowPassword] = useState(false);
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
  return (
    <View style={safeAreaStyle()}>
      <View className="flex-1 justify-center">
        <View className="mx-6">
          <View
            className={`mb-3 rounded-t-xl p-3 justify-between`}
            style={{
              backgroundColor: appStyle.color_surface_variant,
              shadowColor: "#000",
            }}
          >
            <View className="my-3 items-center">
              <FontAwesomeIcon
                icon={faCircleUser}
                color={appStyle.color_on_surface_variant}
                size={50}
              />
              <CustomText
                style={{ color: appStyle.color_on_surface_variant }}
                className="text-2xl my-4"
              >
                {"Welcome :)"}
              </CustomText>
              <CustomText style={{ color: appStyle.color_on_surface_variant }}>
                Sign in and find a partner for your next workout TODAY!
              </CustomText>
            </View>
            <KeyboardAvoidingView
              behavior={Platform.OS == "android" ? null : "padding"}
              enabled={true}
            >
              <ScrollView scrollEnabled={false}>
                <TextInput
                  className="rounded mb-5 px-3 py-1 focus:"
                  style={style.input}
                  placeholder="Email"
                  placeholderTextColor={appStyle.color_outline}
                  onChangeText={(text) => setEmail(text)}
                ></TextInput>
                <View className="mb-5">
                  <TextInput
                    className="rounded px-3 py-1"
                    secureTextEntry={!showPassword}
                    style={style.input}
                    placeholder="Password"
                    placeholderTextColor={appStyle.color_outline}
                    onChangeText={(text) => setPassword(text)}
                  ></TextInput>
                  {password != "" && (
                    <View className="absolute right-0 top-0 bottom-0 justify-center">
                      <CustomButton
                        onPress={() => {
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? (
                          <FontAwesomeIcon
                            icon={faEyeSlash}
                            size={25}
                            color={appStyle.color_on_surface}
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faEye}
                            size={25}
                            color={appStyle.color_on_surface}
                          />
                        )}
                      </CustomButton>
                    </View>
                  )}
                </View>
                <View className="flex-row items-center mb-5">
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
                  className="text-center my-2 text-lg h-8"
                  style={{ color: appStyle.color_error }}
                >
                  {errorText}
                </CustomText>
              </ScrollView>
            </KeyboardAvoidingView>
            <CustomButton
              onPress={loginEmailPassword}
              className={`self-center py-2 px-8 w-full mb-3`}
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
            <CustomButton
              style={{ backgroundColor: appStyle.color_primary }}
              onPress={() => signInGoogleAccount()}
              className={`self-center py-2 w-full items-center`}
            >
              <CustomText
                className="tracking-widest font-bold text-xl"
                style={{
                  color: appStyle.color_on_primary,
                }}
              >
                Continue with Google
              </CustomText>
            </CustomButton>
          </View>
          <CustomButton
            style={{
              borderWidth: 1,
              borderColor: appStyle.color_outline,
              backgroundColor: appStyle.color_surface_variant,
            }}
            onPress={() => navigation.navigate("Register")}
            className={`flex-1 justify-center p-3`}
          >
            <CustomText
              className="text-center text-xl tracking-widest"
              style={{ color: appStyle.color_on_surface_variant }}
            >
              Register
            </CustomText>
          </CustomButton>
        </View>
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
