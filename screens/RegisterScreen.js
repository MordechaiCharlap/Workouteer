import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { React, useLayoutEffect, useState } from "react";
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
  const [registerBackground, setRegisterBackground] = useState(
    appStyle.appDarkBlue
  );
  const [registerColor, setRegisterColor] = useState(appStyle.appAzure);

  const [maleCBValue, setMaleCBValue] = useState(false);
  const [femaleCBValue, setFemaleCBValue] = useState(false);
  const maleCBPressed = () => {
    if (maleCBValue == false) {
      setMaleCBValue(true);
      setFemaleCBValue(false);
      console.log("removing V on female");
    } else {
      setMaleCBValue(false);
    }
  };
  const femaleCBPressed = () => {
    if (femaleCBValue == false) {
      setFemaleCBValue(true);
      setMaleCBValue(false);
      console.log("removing V on male");
    } else {
      setFemaleCBValue(false);
    }
  };
  const registerIn = () => {
    setRegisterBackground(appStyle.appAzure);
    setRegisterColor(appStyle.appDarkBlue);
  };
  const registerOut = () => {
    setRegisterBackground(appStyle.appDarkBlue);
    setRegisterColor(appStyle.appAzure);
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View
        className={`flex-1 my-16 mx-6 rounded-t-xl p-4 ${ResponsiveShadow}`}
        style={{ backgroundColor: appStyle.appDarkBlue, shadowColor: "#000" }}
      >
        <View className="mb-8">
          <Text style={{ color: appStyle.appGray }} className="text-2xl mb-4">
            {"Welcome :)"}
          </Text>
          <Text style={{ color: appStyle.appGray }}>
            Register in a few seconds and find a partner for your next workout
            TODAY!
          </Text>
        </View>
        <View>
          {/* focus:border-sky-500 focus:border-2 */}
          <TextInput
            className="rounded mb-5 px-3 py-1 focus:"
            style={style.input}
            placeholder="First Name"
            placeholderTextColor={"#5f6b8b"}
          ></TextInput>
          <TextInput
            className="rounded mb-5 px-3 py-1 focus:"
            style={style.input}
            placeholder="Last Name"
            placeholderTextColor={"#5f6b8b"}
          ></TextInput>
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
          <TextInput
            className="rounded mb-5 px-3 py-1"
            style={style.input}
            placeholder="Confirm Password"
            placeholderTextColor={"#5f6b8b"}
          ></TextInput>
          <View className="flex-row items-center mb-5 justify-between">
            <Text style={{ color: appStyle.appAzure }}>Sex:</Text>
            <View className="flex-row flex-1 justify-around">
              <View className="ml-2 flex-row items-center">
                <CheckBox
                  backgroundColor={appStyle.appAzure}
                  valueColor={appStyle.appDarkBlue}
                  value={maleCBValue}
                  onPress={maleCBPressed}
                />
                <Text style={{ color: appStyle.appAzure, marginLeft: 3 }}>
                  Male
                </Text>
              </View>
              <View className="ml-2 flex-row items-center">
                <CheckBox
                  backgroundColor={appStyle.appAzure}
                  valueColor={appStyle.appDarkBlue}
                  value={femaleCBValue}
                  onPress={femaleCBPressed}
                />
                <Text style={{ color: appStyle.appAzure, marginLeft: 3 }}>
                  Female
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-row items-center mb-5">
            <CheckBox
              backgroundColor={appStyle.appAzure}
              valueColor={appStyle.appDarkBlue}
              value={false}
            />
            <Text className="ml-2" style={{ color: appStyle.appAzure }}>
              {"I agree to the "}
            </Text>
            <Text
              className="font-semibold underline"
              style={{ color: appStyle.appAzure }}
            >
              Terms and Conditions
            </Text>
          </View>

          <TouchableOpacity
            onPressIn={registerIn}
            onPressOut={registerOut}
            className={`flex-1 rounded-b-xl justify-center border-2 ${ResponsiveShadow}`}
            style={{
              borderColor: appStyle.appAzure,
              backgroundColor: registerBackground,
              shadowColor: appStyle.appAzure,
            }}
          >
            <Text
              className="text-center font-bold text-xl tracking-widest"
              style={{ color: registerColor }}
            >
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomNavbar currentScreen="Register" />
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
