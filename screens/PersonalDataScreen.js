import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { React, useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import safeAreaStyle from "../components/safeAreaStyle";
import * as appStyle from "../components/AppStyleSheet";
import { Dropdown } from "react-native-element-dropdown";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
import useNavbarDisplay from "../hooks/useNavbarDisplay";

const PersonalDataScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("PersonalData");
    }, [])
  );
  const { user } = useAuth();
  const navigation = useNavigation();
  const [isMale, setIsMale] = useState(null);
  const [country, setCountry] = useState(null);
  const [firstNameVal, setFirstNameVal] = useState("");
  const [lastNameVal, setLastNameVal] = useState("");
  const [isAcceptMale, setAcceptMale] = useState(true);
  const [isAcceptFemale, setAcceptFemale] = useState(true);
  const [minAgeAccept, setMinAgeAccept] = useState(16);
  const [maxAgeAccept, setMaxAgeAccept] = useState(100);
  const checkIfDataValid = () => {
    if (isMale != null && country) return true;
    else return false;
  };
  const createAccountPressed = async () => {
    if (checkIfDataValid()) {
      const newData = {
        firstName: firstNameVal,
        lastName: lastNameVal,
        isMale: isMale,
        defaultCountry: country,
        acceptMale: isAcceptMale,
        acceptFemale: isAcceptFemale,
        acceptMinAge: minAgeAccept,
        acceptMaxAge: maxAgeAccept,
      };
      await firebase.updatePersonalData(user, newData);
    } else {
      if (Platform.OS != "web")
        alert(
          "You must choose a country, gender, and fill out your first name"
        );
    }
  };
  return (
    <View className="justify-center" style={safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View
        className={`mx-6 rounded-xl p-4`}
        style={{ backgroundColor: appStyle.color_primary, shadowColor: "#000" }}
      >
        <View>
          <View
            className="mb-5 rounded-t"
            style={{ backgroundColor: appStyle.color_bg }}
          >
            <Text className="text-center text-xl py-2 px-10">
              Personal data
            </Text>
          </View>
        </View>
        <View className="mb-5">
          <Text
            style={{ color: appStyle.color_on_primary }}
            className="text-2xl mb-4"
          >
            {"One last step"}
          </Text>
          <Text style={{ color: appStyle.color_on_primary }}>
            Before you move on we need just a bit more information to make your
            experience a bit more enjoyable
          </Text>
        </View>
        <View className="flex-1">
          <TextInput
            onChangeText={(text) => setFirstNameVal(text)}
            style={style.input}
            placeholder="First Name"
            className="rounded mb-5 px-3 h-10 justify-center"
            placeholderTextColor={"#5f6b8b"}
          ></TextInput>
          <TextInput
            onChangeText={(text) => setLastNameVal(text)}
            className="rounded mb-5 px-3 h-10 justify-center"
            style={style.input}
            placeholder="Last Name"
            placeholderTextColor={"#5f6b8b"}
          ></TextInput>
          <View className="mb-5">
            <Dropdown
              style={style.input}
              containerStyle={{
                borderTopWidth: 0,
                borderBottomWidth: 2,
                borderRightWidth: 2,
                borderLeftWidth: 2,
                borderColor: appStyle.color_bg,
              }}
              itemContainerStyle={{
                position: "relative",
                paddingLeft: 10,
                height: 40,
              }}
              itemTextStyle={{
                position: "absolute",
                fontSize: 16,
              }}
              selectedTextStyle={{ fontSize: 16 }}
              placeholderStyle={{ color: "#5f6b8b", fontSize: 16 }}
              dropdownPosition="bottom"
              placeholder="Country"
              inputSearchStyle={style.inputSearchStyle}
              iconStyle={style.iconStyle}
              data={[{ label: "Israel", value: "Israel" }]}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={country}
              onChange={(item) => {
                setCountry(item.value);
              }}
            />
          </View>
          <View className="mb-5">
            <Dropdown
              style={style.input}
              containerStyle={{
                borderTopWidth: 0,
                borderBottomWidth: 2,
                borderRightWidth: 2,
                borderLeftWidth: 2,
                borderColor: appStyle.color_bg,
              }}
              itemContainerStyle={{
                position: "relative",
                paddingLeft: 10,
                height: 40,
              }}
              itemTextStyle={{
                position: "absolute",
                fontSize: 16,
              }}
              selectedTextStyle={{ fontSize: 16 }}
              placeholderStyle={{ color: "#5f6b8b", fontSize: 16 }}
              dropdownPosition="bottom"
              placeholder="Sex"
              iconStyle={style.iconStyle}
              data={[
                { label: "Male", value: true },
                { label: "Female", value: false },
              ]}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={isMale}
              onChange={(item) => {
                setIsMale(item.value);
              }}
            />
          </View>

          <TouchableOpacity
            onPress={createAccountPressed}
            className={`justify-center py-3`}
            style={{
              backgroundColor: appStyle.color_bg,
              shadowColor: appStyle.color_primary,
            }}
          >
            <Text
              className="text-center font-bold text-xl tracking-widest"
              style={{ color: appStyle.color_primary }}
            >
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PersonalDataScreen;
const style = StyleSheet.create({
  input: {
    borderRadius: 4,
    paddingLeft: 10,
    height: 40,
    borderWidth: 2,
    borderColor: appStyle.color_bg,
    color: appStyle.color_primary,
    backgroundColor: appStyle.color_on_primary,
  },
  text: { color: appStyle.color_on_primary },
  icon: {
    marginRight: 5,
    color: "white",
  },
  label: {
    position: "absolute",
    color: "#ffffff",
    backgroundColor: appStyle.color_primary,
    left: 22,
    top: -10,
    zIndex: 999,
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
