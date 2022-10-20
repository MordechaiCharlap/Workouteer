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
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { ResponsiveShadow } from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { Dropdown } from "react-native-element-dropdown";
const PersonalDataScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const [registerBackground, setRegisterBackground] = useState(
    appStyle.appDarkBlue
  );
  const [registerColor, setRegisterColor] = useState(appStyle.appAzure);

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
        className={`flex-1 mt-6 mx-6 rounded-t-xl p-4 ${ResponsiveShadow}`}
        style={{ backgroundColor: appStyle.appDarkBlue, shadowColor: "#000" }}
      >
        <View className="mb-8">
          <Text style={{ color: appStyle.appGray }} className="text-2xl mb-4">
            {"Your account is created!"}
          </Text>
          <Text style={{ color: appStyle.appGray }}>
            Now we need some additional information so we could help you pair
            with the right workout buddies!
          </Text>
        </View>
        <View className="flex-1">
          <TextInput
            className="rounded mb-5 px-3 py-1"
            style={style.input}
            placeholder="First Name"
            placeholderTextColor={"#5f6b8b"}
          ></TextInput>
          <TextInput
            className="rounded mb-5 px-3 py-1"
            style={style.input}
            placeholder="Last Name"
            placeholderTextColor={"#5f6b8b"}
          ></TextInput>
          <View className="mb-5">
            <Dropdown
              style={[
                style.dropdown,
                isFocus && { borderColor: appStyle.appAzure },
              ]}
              placeholder="Sex"
              placeholderStyle={style.placeholderStyle}
              selectedTextStyle={style.selectedTextStyle}
              inputSearchStyle={style.inputSearchStyle}
              iconStyle={style.iconStyle}
              data={[
                { label: "Male", value: true },
                { label: "Female", value: false },
              ]}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setValue(item.value);
                setIsFocus(false);
              }}
            />
          </View>

          <View className="mb-10">
            <Text
              className="text-center text-2xl rounded-xl mb-5"
              style={{ backgroundColor: appStyle.appGray }}
            >
              Workout preferences
            </Text>
            <Text className="text-center mb-2 font-semibold" style={style.text}>
              Partner's age
            </Text>
            <View className="flex-row justify-around mb-5">
              <View className="flex-row w-1/2">
                <Text style={style.text}>From: </Text>
                <TextInput
                  className="rounded w-1/2"
                  style={style.input}
                  placeholder="Minimum age"
                  value={16}
                ></TextInput>
              </View>
              <View className="flex-row w-1/2">
                <Text style={style.text}>To: </Text>
                <TextInput
                  className="rounded w-1/2"
                  style={style.input}
                  placeholder="Maximum age"
                  value={100}
                ></TextInput>
              </View>
            </View>
            <Text className="text-center mb-2 font-semibold" style={style.text}>
              Partner's sex
            </Text>
            <View className="flex-row justify-around">
              <View className="flex-row">
                <CheckBox
                  backgroundColor={appStyle.appAzure}
                  valueColor={appStyle.appDarkBlue}
                  value={true}
                />
                <Text style={style.text}>Male</Text>
              </View>
              <View className="flex-row">
                <CheckBox
                  backgroundColor={appStyle.appAzure}
                  valueColor={appStyle.appDarkBlue}
                  value={true}
                />
                <Text style={style.text}>Female</Text>
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
            className={`rounded-b-xl justify-center border-2 ${ResponsiveShadow}`}
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
    </SafeAreaView>
  );
};

export default PersonalDataScreen;
const style = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#5f6b8b",
    color: appStyle.appGray,
  },
  text: { color: appStyle.appGray },
  container: {
    paddingHorizontal: 16,
  },
  dropdown: {
    height: 30,
    borderColor: "#5f6b8b",
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
    color: "white",
  },
  label: {
    position: "absolute",
    // fontWeight: 450,
    color: "#5f6b8b",
    backgroundColor: appStyle.appYellow,
    left: 22,
    top: -10,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    color: "#5f6b8b",
    // fontWeight: 600,
    fontSize: 16,
  },
  selectedTextStyle: {
    // fontWeight: 600,
    color: "#5f6b8b",
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
