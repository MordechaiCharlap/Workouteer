import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  StatusBar,
} from "react-native";
import { React, useLayoutEffect, useState } from "react";
import CheckBox from "../components/CheckBox";
import { useNavigation } from "@react-navigation/native";
import responsiveStyle from "../components/ResponsiveStyling";
import { ResponsiveShadow } from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
import LoadingAnimation from "../components/LoadingAnimation";
const LoginScreen = () => {
  const { signInEmailPassword, initialLoading, signInGoogleAccount } =
    useAuth();
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
    appStyle.color_on_primary
  );
  const [registerColor, setRegisterColor] = useState(appStyle.appLightBlue);

  const [loginBackground, setLoginBackground] = useState(appStyle.appLightBlue);
  const [loginColor, setLoginColor] = useState(appStyle.color_on_primary);
  const [loginBorderColor, setLoginBorderColor] = useState("transparent");
  const registerIn = () => {
    setRegisterBackground(appStyle.appLightBlue);
    setRegisterColor(appStyle.color_on_primary);
  };
  const registerOut = () => {
    setRegisterBackground(appStyle.color_on_primary);
    setRegisterColor(appStyle.appLightBlue);
  };
  const loginIn = () => {
    setLoginBackground(appStyle.color_on_primary);
    setLoginColor(appStyle.appLightBlue);
    setLoginBorderColor(appStyle.appLightBlue);
  };
  const loginOut = () => {
    setLoginBackground(appStyle.appLightBlue);
    setLoginColor(appStyle.color_on_primary);
    setLoginBorderColor("transparent");
  };

  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      {initialLoading ? (
        <LoadingAnimation />
      ) : (
        <View className="flex-1 my-20 mx-6">
          <View
            className={`mb-5 basis-4/5 rounded-t-xl p-4  justify-between ${ResponsiveShadow}`}
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
            </View>
            <TouchableOpacity
              onPress={() => signInEmailPassword(email, password, rememberMe)}
              className={`self-center rounded py-2 px-8 w-full`}
              style={{
                backgroundColor: appStyle.color_primary_variant,
                borderWidth: 0.5,
                borderColor: appStyle.color_on_primary,
              }}
            >
              <Text
                className="text-center tracking-widest font-bold text-xl"
                style={{
                  color: appStyle.color_on_primary,
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => signInGoogleAccount()}
              className={`self-center rounded py-2 px-8 w-full border-2`}
              style={{
                backgroundColor: appStyle.color_on_primary,
              }}
            >
              <Text
                className="text-center tracking-widest font-bold text-xl"
                style={{
                  color: appStyle.color_primary,
                }}
              >
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>
          <View
            className={`basis-1/5 rounded-b-xl justify-center p-2 ${ResponsiveShadow}`}
            style={{
              backgroundColor: appStyle.color_on_primary,
              shadowColor: "#000",
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              className={`flex-1 rounded-b-xl justify-center ${ResponsiveShadow}`}
              style={{
                backgroundColor: appStyle.color_primary,
                shadowColor: appStyle.appLightBlue,
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
    backgroundColor: appStyle.color_primary,
    borderWidth: 1,
    borderColor: "#5f6b8b",
    color: appStyle.color_on_primary,
  },
});
