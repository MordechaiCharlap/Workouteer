import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { React, useLayoutEffect } from "react";
import CheckBox from "../components/CheckBox";
import BottomNavbar from "../components/BottomNavbar";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { ResponsiveShadow } from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
const LoginScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const testMethod = () => {};
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1 my-32 mx-6">
        <View
          className={`mb-5 basis-4/5 rounded-t-xl px-4 py-4  justify-between ${ResponsiveShadow}`}
          style={{ backgroundColor: appStyle.appDarkBlue, shadowColor: "#000" }}
        >
          <View className="mb-3">
            <Text style={{ color: appStyle.appGray }} className="text-2xl mb-4">
              {"Welcome :)"}
            </Text>
            <Text style={{ color: appStyle.appGray }}>
              Sign in to manage your account
            </Text>
          </View>
          <View>
            {/* focus:border-sky-500 focus:border-2 */}
            <TextInput
              className="rounded mb-5 px-3 py-1 focus:"
              style={style.input}
              placeholder="Email"
              placeholderTextColor={"#5f6b8b"}
            ></TextInput>
            <TextInput
              className="rounded mb-5 px-3 py-1"
              style={style.input}
              placeholder="Password"
              placeholderTextColor={"#5f6b8b"}
            ></TextInput>
            <View className="flex-row">
              <CheckBox
                backgroundColor={appStyle.appAzure}
                valueColor={appStyle.appDarkBlue}
                value={true}
              />
              <Text className="ml-2" style={{ color: appStyle.appAzure }}>
                Remember me!
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="self-center rounded py-2 px-8 w-full"
            style={{ backgroundColor: appStyle.appAzure }}
          >
            <Text
              className="text-center tracking-widest font-bold text-xl"
              style={{ color: appStyle.appDarkBlue }}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className={`basis-1/5 rounded-b-xl justify-center ${ResponsiveShadow}`}
          style={{ backgroundColor: appStyle.appDarkBlue, shadowColor: "#000" }}
        >
          <Text
            className="text-center font-bold text-xl"
            style={{ color: appStyle.appGray }}
          >
            Register
          </Text>
        </TouchableOpacity>
      </View>

      <BottomNavbar currentScreen="Login" />
    </SafeAreaView>
  );
};

export default LoginScreen;
const style = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#5f6b8b",
    color: appStyle.appGray,
  },
});
