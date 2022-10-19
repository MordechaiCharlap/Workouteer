import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import { React, useLayoutEffect, useState } from "react";
import CheckBox from "../components/CheckBox";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { ResponsiveShadow } from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { authImport, firestoreImport } from "../firebase-config";
import useUserData from "../hooks/useUserData";
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

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
    signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        console.log("signed in!");
        const userData = await useUserData(email);
        console.log(userData);
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
