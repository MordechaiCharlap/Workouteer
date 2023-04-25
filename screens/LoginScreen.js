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
    console.log(`got new one: ${authErrorCode}`);
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
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      {initialLoading ? (
        <LoadingAnimation />
      ) : (
        <View className="flex-1 justify-center">
          <View className="mx-6">
            <View
              className={`mb-3 rounded-t-xl p-3 justify-between`}
              style={{
                backgroundColor: appStyle.color_primary,
                shadowColor: "#000",
              }}
            >
              <View className="my-3 items-center">
                <FontAwesomeIcon
                  icon={faCircleUser}
                  color={appStyle.color_on_primary}
                  size={50}
                />
                <Text
                  style={{ color: appStyle.color_on_primary }}
                  className="text-2xl my-4"
                >
                  {"Welcome :)"}
                </Text>
                <Text style={{ color: appStyle.color_on_primary }}>
                  Sign in and find a partner for your next workout TODAY!
                </Text>
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
                    placeholderTextColor={"#5f6b8b"}
                    onChangeText={(text) => setEmail(text)}
                  ></TextInput>
                  <View className="mb-5">
                    <TextInput
                      className="rounded px-3 py-1"
                      secureTextEntry={!showPassword}
                      style={style.input}
                      placeholder="Password"
                      placeholderTextColor={"#5f6b8b"}
                      onChangeText={(text) => setPassword(text)}
                    ></TextInput>
                    {password != "" && (
                      <View className="absolute right-3 top-0 bottom-0 justify-center">
                        <TouchableOpacity
                          onPress={() => {
                            setShowPassword(!showPassword);
                          }}
                        >
                          {showPassword ? (
                            <FontAwesomeIcon
                              icon={faEyeSlash}
                              size={25}
                              color={appStyle.color_primary}
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faEye}
                              size={25}
                              color={appStyle.color_primary}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <View className="flex-row items-center mb-5">
                    <CheckBox
                      valueColor={appStyle.color_primary}
                      backgroundColor={appStyle.color_bg}
                      value={false}
                      onValueChange={(value) => setRememberMe(value)}
                    />
                    <Text
                      className="ml-2"
                      style={{ color: appStyle.color_on_primary }}
                    >
                      Remember me!
                    </Text>
                  </View>
                  <Text
                    className="text-center my-2 text-lg h-8"
                    style={{ color: appStyle.color_error }}
                  >
                    {errorText}
                  </Text>
                </ScrollView>
              </KeyboardAvoidingView>
              <TouchableOpacity
                onPress={loginEmailPassword}
                className={`self-center py-2 px-8 w-full mb-3`}
                style={{
                  backgroundColor: appStyle.color_bg,
                }}
              >
                <Text
                  className="text-center tracking-widest font-bold text-xl"
                  style={{
                    color: appStyle.color_primary,
                  }}
                >
                  {loginLoading == true ? "Loading" : "Login"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => signInGoogleAccount()}
                className={`self-center py-2 w-full items-center`}
                style={{
                  backgroundColor: appStyle.color_on_primary,
                }}
              >
                <Text
                  className="tracking-widest font-bold text-xl"
                  style={{
                    color: appStyle.color_primary,
                  }}
                >
                  Continue with Google
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              className={`flex-1 rounded-b-xl justify-center p-3`}
              style={{
                backgroundColor: appStyle.color_primary,
                shadowColor: appStyle.color_bg,
              }}
            >
              <Text
                className="text-center font-bold text-xl tracking-widest"
                style={{ color: appStyle.color_on_primary }}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default LoginScreen;
const style = StyleSheet.create({
  input: {
    paddingLeft: 10,
    height: 40,
    borderWidth: 2,
    borderColor: appStyle.color_bg,
    color: appStyle.color_primary,
    backgroundColor: appStyle.color_on_primary,
  },
});
