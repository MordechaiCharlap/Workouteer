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
import { React, useLayoutEffect, useState, useContext } from "react";
import CheckBox from "../components/CheckBox";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { ResponsiveShadow } from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { createUserWithEmailAndPassword } from "firebase/auth";
import * as firebase from "../services/firebase";
import DateTimePicker from "@react-native-community/datetimepicker";
const LoginScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const auth = firebase.auth;
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  //Datepicker state
  const [date, setDate] = useState(new Date(1598051730000));
  const [show, setShow] = useState(false);
  const [changedOnce, setChangeOnce] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setShow(false);
    setChangeOnce(true);
  };

  const showDatepicker = () => {
    setShow(true);
  };
  const handleCreateAccount = async () => {
    if (acceptTerms) {
      if (changedOnce) {
        var age = calculateAge();
        var isUserAvailable = await firebase.checkUsername(username);
        var isEmailAvailable = await firebase.checkEmail(email);
        if (age >= 16) {
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
        } else {
          console.log("Need to be >=16");
        }
      } else {
        console.log("Choose birthdate");
      }
    } else {
      console.log("Accept terms before going further");
    }
  };
  const calculateAge = () => {
    var today = new Date();
    var age = today.getFullYear() - date.getFullYear();
    var m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return age;
  };
  const handleLogin = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log("signed in!");
        console.log(userCredential.user.uid);
        const newUserData = {
          img: "https://img.freepik.com/free-vector/man-practicing-dance-fitness-home_23-2148890577.jpg?w=2000",
          username: username,
          displayName: displayName,
          usernameLower: username.toLowerCase(),
          birthdate: date,
          email: email.toLowerCase(),
          id: userCredential.user.uid,
        };
        await firebase.createUser(newUserData);
        await firebase.createUserRequestsDocs(newUserData);
        navigation.navigate("PersonalData");
      })
      .catch((error) => {
        console.log(error);
        Alert.alert(error.message);
      });
  };
  return (
    <SafeAreaView
      style={[
        ResponsiveStyling.safeAreaStyle,
        { backgroundColor: appStyle.appAzure },
      ]}
    >
      <View
        className={`flex-1 my-16 mx-6 rounded-xl p-4 ${ResponsiveShadow}`}
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
        <View className="flex-1 justify-between">
          <View>
            <TextInput
              className="rounded mb-5 px-3 h-10 justify-center"
              style={style.input}
              placeholder="Email"
              placeholderTextColor={"#5f6b8b"}
              onChangeText={(text) => setEmail(text)}
            ></TextInput>
            <TextInput
              className="rounded mb-5 px-3 h-10 justify-center"
              style={style.input}
              placeholder="Username (Must be unique)"
              placeholderTextColor={"#5f6b8b"}
              onChangeText={(text) => setUsername(text)}
            ></TextInput>
            <TextInput
              className="rounded mb-5 px-3 h-10 justify-center"
              style={style.input}
              placeholder="Display name"
              placeholderTextColor={"#5f6b8b"}
              onChangeText={(text) => setDisplayName(text)}
            ></TextInput>
            <TouchableOpacity
              className="rounded mb-5 px-3 h-10 justify-center"
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
                onChange={onDateChange}
              />
            )}
            <TextInput
              className="rounded mb-5 px-3 h-10 justify-center"
              secureTextEntry={true}
              style={style.input}
              placeholder="Password"
              placeholderTextColor={"#5f6b8b"}
              onChangeText={(text) => setPassword(text)}
            ></TextInput>
            <TextInput
              className="rounded mb-5 px-3 h-10 justify-center"
              secureTextEntry={true}
              style={style.input}
              placeholder="Confirm Password"
              placeholderTextColor={"#5f6b8b"}
            ></TextInput>
          </View>
          <View>
            <View className="flex-row items-center mb-5">
              <CheckBox
                backgroundColor={appStyle.appAzure}
                valueColor={appStyle.appDarkBlue}
                value={false}
                onValueChange={setAcceptTerms}
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
              className={`flex-1 rounded p-2 justify-center border-2 ${ResponsiveShadow}`}
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
