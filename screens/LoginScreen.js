import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import { React, useLayoutEffect, useState, useEffect } from "react";
import CheckBox from "../components/CheckBox";
import { useNavigation } from "@react-navigation/native";
import responsiveStyle from "../components/ResponsiveStyling";
import { ResponsiveShadow } from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
import Lottie from "lottie-react-native";
const LoginScreen = () => {
  const { signInEmailPassword, initialLoading } = useAuth();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [registerBackground, setRegisterBackground] = useState(
    appStyle.appDarkBlue
  );
  const [registerColor, setRegisterColor] = useState(appStyle.appLightBlue);

  const [loginBackground, setLoginBackground] = useState(appStyle.appLightBlue);
  const [loginColor, setLoginColor] = useState(appStyle.appDarkBlue);
  const [loginBorderColor, setLoginBorderColor] = useState("transparent");
  const registerIn = () => {
    setRegisterBackground(appStyle.appLightBlue);
    setRegisterColor(appStyle.appDarkBlue);
  };
  const registerOut = () => {
    setRegisterBackground(appStyle.appDarkBlue);
    setRegisterColor(appStyle.appLightBlue);
  };
  const loginIn = () => {
    setLoginBackground(appStyle.appDarkBlue);
    setLoginColor(appStyle.appLightBlue);
    setLoginBorderColor(appStyle.appLightBlue);
  };
  const loginOut = () => {
    setLoginBackground(appStyle.appLightBlue);
    setLoginColor(appStyle.appDarkBlue);
    setLoginBorderColor("transparent");
  };

  return (
    <SafeAreaView
      style={[
        ResponsiveStyling.safeAreaStyle,
        {
          backgroundColor: initialLoading
            ? appStyle.appDarkBlue
            : appStyle.appLightBlue,
        },
      ]}
    >
      {initialLoading ? (
        <View className="flex-1">
          {Platform.OS == "android" && (
            <Lottie
              source={require("../animations/initialLoading.json")}
              autoPlay
              loop
            />
          )}
          <View className="h-1/3"></View>
          <Text
            style={{ color: appStyle.appLightBlue }}
            className="text-5xl font-semibold tracking-widest text-white text-center"
          >
            Loading
          </Text>
        </View>
      ) : (
        <View className="flex-1 my-20 mx-6">
          <View
            className={`mb-5 basis-4/5 rounded-t-xl p-4  justify-between ${ResponsiveShadow}`}
            style={{
              backgroundColor: appStyle.appDarkBlue,
              shadowColor: "#000",
            }}
          >
            <View className="my-3 items-center">
              <FontAwesomeIcon
                icon={faCircleUser}
                color={appStyle.appGray}
                size={50}
              />
              <Text
                style={{ color: appStyle.appGray }}
                className="text-2xl my-4"
              >
                {"Welcome :)"}
              </Text>
              <Text style={{ color: appStyle.appGray }}>
                Sign in and find a partner for your next workout TODAY!
              </Text>
            </View>
            <View>
              {/* focus:border-sky-500 focus:border-2 */}
              <TextInput
                className="rounded mb-5 px-3 py-1 focus:"
                style={style.input}
                placeholder="Email"
                placeholderTextColor={"#5f6b8b"}
                onChangeText={(text) => setEmail(text)}
              ></TextInput>
              <TextInput
                className="rounded mb-5 px-3 py-1"
                secureTextEntry={true}
                style={style.input}
                placeholder="Password"
                placeholderTextColor={"#5f6b8b"}
                onChangeText={(text) => setPassword(text)}
              ></TextInput>
              <View className="flex-row items-center">
                <CheckBox
                  valueColor={appStyle.appDarkBlue}
                  value={false}
                  onValueChange={(value) => setRememberMe(value)}
                />
                <Text className="ml-2" style={{ color: appStyle.appGray }}>
                  Remember me!
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => signInEmailPassword(email, password, rememberMe)}
              onPressIn={loginIn}
              onPressOut={loginOut}
              className={`self-center rounded py-2 px-8 w-full border-2`}
              style={{
                backgroundColor: loginBackground,
                borderColor: loginBorderColor,
              }}
            >
              <Text
                className="text-center tracking-widest font-bold text-xl"
                style={{
                  color: loginColor,
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
          <View
            className={`basis-1/5 rounded-b-xl justify-center p-4 ${ResponsiveShadow}`}
            style={{
              backgroundColor: appStyle.appDarkBlue,
              shadowColor: "#000",
            }}
          >
            <TouchableOpacity
              onPressIn={registerIn}
              onPressOut={registerOut}
              onPress={() => navigation.navigate("Register")}
              className={`flex-1 rounded-b-xl justify-center border-2 ${ResponsiveShadow}`}
              style={{
                borderColor: appStyle.appLightBlue,
                backgroundColor: registerBackground,
                shadowColor: appStyle.appLightBlue,
              }}
            >
              <Text
                className="text-center font-bold text-xl tracking-widest"
                style={{ color: registerColor }}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default LoginScreen;
const style = StyleSheet.create({
  input: {
    backgroundColor: appStyle.appGray,
    borderWidth: 1,
    borderColor: "#5f6b8b",
    color: appStyle.appDarkBlue,
  },
});
