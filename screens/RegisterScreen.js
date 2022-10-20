import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { React, useLayoutEffect, useState } from "react";
import CheckBox from "../components/CheckBox";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { ResponsiveShadow } from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { authImport, firestoreImport } from "../firebase-config";
import DateTimePicker from "@react-native-community/datetimepicker";
import useCheckUsername from "../hooks/useCheckUsername";
import useCheckEmail from "../hooks/userCheckEmail";
const LoginScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const auth = authImport;
  const firestore = firestoreImport;
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [date, setDate] = useState(new Date(1598051730000));
  const [show, setShow] = useState(false);
  const [changedOnce, setChangeOnce] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setShow(false);
    setChangeOnce(true);
  };

  const showDatepicker = () => {
    setShow(true);
  };
  const handleCreateAccount = async () => {
    var isUserAvailable = await useCheckUsername(username);
    var isEmailAvailable = await useCheckEmail(email);
    if (username.length >= 6) {
      if (isUserAvailable) {
        console.log(username);
        console.log("username is good");
        if (isEmailAvailable) {
          console.log(email);
          console.log("email is good");
          handleLogin();
        } else {
          console.log("email isnt available");
        }
      } else {
        console.log("Username isnt available");
      }
    } else {
      console.log("Username too small (6+ characters)");
    }
  };
  const handleLogin = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log("signed in!");
        await setDoc(doc(firestore, "users", userCredential.user.uid), {
          username: username,
          usernameLower: username.toLocaleLowerCase(),
          email: email.toLocaleLowerCase(),
        });
      })
      .catch((error) => {
        console.log(error);
        Alert.alert(error.message);
      });
  };

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
          <TextInput
            className="rounded mb-5 px-3 py-1 focus:"
            style={style.input}
            placeholder="Email"
            placeholderTextColor={"#5f6b8b"}
            onChangeText={(text) => setEmail(text)}
          ></TextInput>
          <TextInput
            className="rounded mb-5 px-3 py-1 focus:"
            style={style.input}
            placeholder="Username (Your app screen name)"
            placeholderTextColor={"#5f6b8b"}
            onChangeText={(text) => setUsername(text)}
          ></TextInput>
          <TouchableOpacity
            className="rounded mb-5 px-3 py-1"
            style={style.input}
            onPress={showDatepicker}
          >
            {!changedOnce && (
              <Text style={{ color: "#5f6b8b" }}>
                birthdate (works only on Android)
              </Text>
            )}
            {changedOnce && (
              <Text style={{ color: "#5f6b8b" }}>{date.toDateString()}</Text>
            )}
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              onChange={onChange}
            />
          )}
          <TextInput
            className="rounded mb-5 px-3 py-1"
            secureTextEntry={true}
            style={style.input}
            placeholder="Password"
            placeholderTextColor={"#5f6b8b"}
            onChangeText={(text) => setPassword(text)}
          ></TextInput>
          <TextInput
            className="rounded mb-5 px-3 py-1"
            secureTextEntry={true}
            style={style.input}
            placeholder="Confirm Password"
            placeholderTextColor={"#5f6b8b"}
          ></TextInput>
          <View className="flex-row items-center mb-5 justify-between">
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
            onPress={handleCreateAccount}
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
