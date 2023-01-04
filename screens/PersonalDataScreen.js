import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { React, useLayoutEffect, useState } from "react";
import CheckBox from "../components/CheckBox";
import { useNavigation } from "@react-navigation/native";
import responsiveStyle from "../components/ResponsiveStyling";
import { ResponsiveShadow } from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { Dropdown } from "react-native-element-dropdown";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
const PersonalDataScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const [isMale, setIsMale] = useState(null);
  const [country, setCountry] = useState(null);
  const [isMaleIsFocus, setIsMaleIsFocus] = useState(false);
  const [countryIsFocus, setCountryIsFocus] = useState(false);
  const [firstNameVal, setFirstNameVal] = useState("");
  const [lastNameVal, setLastNameVal] = useState("");
  const [isAcceptMale, setAcceptMale] = useState(true);
  const [isAcceptFemale, setAcceptFemale] = useState(true);
  const [minAgeAccept, setMinAgeAccept] = useState(16);
  const [maxAgeAccept, setMaxAgeAccept] = useState(100);
  const checkIfDataValid = () => {
    return true;
  };
  const createAccountPressed = async () => {
    if (checkIfDataValid()) {
      const newData = {
        firstName: firstNameVal,
        lastName: lastNameVal,
        isMale: isMale,
        country: country,
        acceptMale: isAcceptMale,
        acceptFemale: isAcceptFemale,
        acceptMinAge: minAgeAccept,
        acceptMaxAge: maxAgeAccept,
      };
      await firebase.updatePersonalData(user, newData);
      navigation.navigate("Home");
    }
  };
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <View
        className="flex-1 p-4"
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
          <Text
            className="text-center text-xl mb-5 py-2"
            style={{ backgroundColor: appStyle.appAzure }}
          >
            Personal data
          </Text>
          <TextInput
            onChangeText={(text) => setFirstNameVal(text)}
            className="rounded mb-5 px-3 py-1"
            style={style.input}
            placeholder="First Name"
            placeholderTextColor={"#5f6b8b"}
          ></TextInput>
          <TextInput
            onChangeText={(text) => setLastNameVal(text)}
            className="rounded mb-5 px-3 py-1"
            style={style.input}
            placeholder="Last Name"
            placeholderTextColor={"#5f6b8b"}
          ></TextInput>
          <View className="mb-5">
            <Dropdown
              style={[
                style.dropdown,
                countryIsFocus && { borderColor: appStyle.appAzure },
              ]}
              placeholder="Country"
              placeholderStyle={style.placeholderStyle}
              selectedTextStyle={style.selectedTextStyle}
              inputSearchStyle={style.inputSearchStyle}
              iconStyle={style.iconStyle}
              data={[{ label: "Israel", value: "Israel" }]}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={country}
              onFocus={() => setCountryIsFocus(true)}
              onBlur={() => setCountryIsFocus(false)}
              onChange={(item) => {
                setCountry(item.value);
                setCountryIsFocus(false);
              }}
            />
          </View>
          <View className="mb-5">
            <Dropdown
              style={[
                style.dropdown,
                isMaleIsFocus && { borderColor: appStyle.appAzure },
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
              value={isMale}
              onFocus={() => setIsMaleIsFocus(true)}
              onBlur={() => setIsMaleIsFocus(false)}
              onChange={(item) => {
                setIsMale(item.value);
                setIsMaleIsFocus(false);
              }}
            />
          </View>

          <View className="mb-10">
            <Text
              className="text-center text-xl mb-5 py-2"
              style={{ backgroundColor: appStyle.appAzure }}
            >
              Workout preferences
            </Text>

            <View className="mb-5">
              <View className="flex-row w-1/2 items-center">
                <Text className="font-semibold mr-5" style={style.text}>
                  Partner's age:
                </Text>
                <Text style={style.text}>From</Text>
                <TextInput
                  onChangeText={(text) => setMinAgeAccept(text)}
                  className="rounded w-1/2 text-center"
                  style={style.input}
                  placeholder="Minimum age"
                  placeholderTextColor={"#5f6b8b"}
                  value={16}
                ></TextInput>
                <Text style={style.text}>to</Text>
                <TextInput
                  onChangeText={(text) => setMaxAgeAccept(text)}
                  className="rounded w-1/2 text-center"
                  style={style.input}
                  placeholder="Maximum age"
                  placeholderTextColor={"#5f6b8b"}
                  value={100}
                ></TextInput>
              </View>
            </View>

            <View className="flex-row items-center">
              <Text className="font-semibold mr-5" style={style.text}>
                Partner's sex:
              </Text>
              <View className="flex-row mr-5 items-center">
                <CheckBox
                  onValueChange={(value) => setAcceptMale(value)}
                  backgroundColor={appStyle.appAzure}
                  valueColor={appStyle.appDarkBlue}
                  value={true}
                />
                <Text style={style.text}>Male</Text>
              </View>
              <View className="flex-row items-center">
                <CheckBox
                  onValueChange={(value) => setAcceptFemale(value)}
                  backgroundColor={appStyle.appAzure}
                  valueColor={appStyle.appDarkBlue}
                  value={true}
                />
                <Text style={style.text}>Female</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={createAccountPressed}
            className={`justify-center py-3 ${ResponsiveShadow}`}
            style={{
              backgroundColor: appStyle.appAzure,
              shadowColor: appStyle.appAzure,
            }}
          >
            <Text
              className="text-center font-bold text-xl tracking-widest"
              style={{ color: appStyle.appDarkBlue }}
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
    fontSize: 16,
  },
  selectedTextStyle: {
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
