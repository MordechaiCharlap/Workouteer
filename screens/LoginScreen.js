import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

import { React, useLayoutEffect, useState } from "react";
import CheckBox from "../components/CheckBox";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { ResponsiveShadow } from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { authImport, firestoreImport } from "../firebase-config";
const LoginScreen = () => {
  const navigation = useNavigation();
  const auth = authImport;
  const firestore = firestoreImport;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    test();
  }, []);
  const test = async () => {
    const q = query(
      collection(firestore, "users"),
      where("username", "==", "Fasteriko")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("signed in!");
        const user = userCredential.user;
        navigation.navigate("Home");
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

  const [loginBackground, setLoginBackground] = useState(appStyle.appAzure);
  const [loginColor, setLoginColor] = useState(appStyle.appDarkBlue);
  const [loginBorderColor, setLoginBorderColor] = useState("transparent");
  const registerIn = () => {
    setRegisterBackground(appStyle.appAzure);
    setRegisterColor(appStyle.appDarkBlue);
  };
  const registerOut = () => {
    setRegisterBackground(appStyle.appDarkBlue);
    setRegisterColor(appStyle.appAzure);
  };
  const loginIn = () => {
    setLoginBackground(appStyle.appDarkBlue);
    setLoginColor(appStyle.appAzure);
    setLoginBorderColor(appStyle.appAzure);
  };
  const loginOut = () => {
    setLoginBackground(appStyle.appAzure);
    setLoginColor(appStyle.appDarkBlue);
    setLoginBorderColor("transparent");
  };

  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1 my-32 mx-6">
        <View
          className={`mb-5 basis-4/5 rounded-t-xl p-4  justify-between ${ResponsiveShadow}`}
          style={{ backgroundColor: appStyle.appDarkBlue, shadowColor: "#000" }}
        >
          <View className="mb-3">
            <Text style={{ color: appStyle.appGray }} className="text-2xl mb-4">
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
              style={style.input}
              placeholder="Password"
              placeholderTextColor={"#5f6b8b"}
              onChangeText={(text) => setPassword(text)}
            ></TextInput>
            <View className="flex-row items-center">
              <CheckBox
                backgroundColor={appStyle.appAzure}
                valueColor={appStyle.appDarkBlue}
                value={false}
              />
              <Text className="ml-2" style={{ color: appStyle.appAzure }}>
                Remember me!
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleLogin}
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
          style={{ backgroundColor: appStyle.appDarkBlue, shadowColor: "#000" }}
        >
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
              Register
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
