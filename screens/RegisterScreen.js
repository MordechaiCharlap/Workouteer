import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  Image,
  StatusBar,
  ScrollView,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { React, useLayoutEffect, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import CheckBox from "../components/CheckBox";
import { useNavigation } from "@react-navigation/native";
import responsiveStyle from "../components/ResponsiveStyling";
import { ResponsiveShadow } from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { createUserWithEmailAndPassword } from "firebase/auth";
import * as firebase from "../services/firebase";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleUser, faPlus } from "@fortawesome/free-solid-svg-icons";
import usePushNotifications from "../hooks/usePushNotifications";
const LoginScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const auth = firebase.auth;
  const { pushToken } = usePushNotifications();
  const [email, setEmail] = useState("");
  const [emailStyle, setEmailStyle] = useState(style.input);
  const [username, setUsername] = useState("");
  const [usernameStyle, setUsernameStyle] = useState(style.input);
  const [password, setPassword] = useState("");
  const [passwordStyle, setPasswordStyle] = useState(style.input);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordStyle, setConfirmPasswordStyle] = useState(style.input);
  const [confirmPasswordText, setConfirmPasswordText] = useState("");
  // const [displayName, setDisplayName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [inputErrorText, setInputErrorText] = useState("");
  //Datepicker state
  const [date, setDate] = useState(new Date());
  const [dateStyle, setDateStyle] = useState(style.input);
  const [show, setShow] = useState(false);
  const [changedOnce, setChangeOnce] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setShow(false);
    setChangeOnce(true);
    const age = calculateAge(currentDate);
    if (age < 16) {
      console.log(age);
      alert("You need to be at least 16 to use this app");
      setDateStyle(style.badInput);
    } else {
      setDateStyle(style.input);
    }
  };
  const openImageLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.cancelled) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.localUri || result.uri,
        [{ resize: { height: 1080, width: 1080 } }],
        {
          compress: 0.5,
          height: 1080,
          width: 1080,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      const uploadUrl = await firebase.uploadProfileImage(
        props.user.id,
        manipResult.uri
      );
      console.log("uploadUrl: " + uploadUrl);
      setImage(uploadUrl);
    }
  };
  const showDatepicker = () => {
    setShow(true);
  };
  const handleCreateAccount = async () => {
    setInputErrorText("");

    if (confirmPassword == password) {
      if (username.length >= 6) {
        if (changedOnce) {
          var age = calculateAge(date);
          var isUserAvailable = await firebase.checkUsername(
            username.toLowerCase()
          );
          var isEmailAvailable = await firebase.checkEmail(
            email.toLocaleLowerCase()
          );

          if (age >= 16) {
            if (isUserAvailable) {
              if (isEmailAvailable) {
                if (acceptTerms) {
                  setInputErrorText("");
                  handleLogin();
                } else setInputErrorText("Accept terms before going further");
              } else setInputErrorText("email isnt available");
            } else setInputErrorText("Username isnt available");
          } else setInputErrorText("You need to be at least 16 years old");
        } else setInputErrorText("Choose birthdate");
      } else setInputErrorText("Username too small (6+ characters)");
    } else
      setInputErrorText(
        "Your 'confirmed' password does not match your original password: ",
        password,
        " and ",
        confirmPassword
      );
  };
  const calculateAge = (dateToCheck) => {
    var today = new Date();
    var age = today.getFullYear() - dateToCheck.getFullYear();
    var m = today.getMonth() - dateToCheck.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dateToCheck.getDate())) {
      age--;
    }
    return age;
  };
  const emailLostFocus = () => {
    var validRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(validRegex)) {
      console.log("good email");
      setEmailStyle(style.input);
    } else {
      alert("Invalid email");
      setEmailStyle(style.badInput);
    }
  };
  const usernameLostFocus = () => {
    var validRegex = /^[a-zA-Z0-9]{6,20}$/;
    if (username.match(validRegex)) {
      console.log("good username");
      setUsernameStyle(style.input);
    } else {
      alert(
        "Invalid username, Only english letters/numbers, between 6-20 characters"
      );
      setUsernameStyle(style.badInput);
    }
  };
  const passwordLostFocus = () => {
    var validRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
    if (password.match(validRegex)) {
      console.log("good password");
      setPasswordStyle(style.input);
    } else {
      alert(
        "Invalid password, should be 8-20 characters, at least one number and one letter"
      );
      setPasswordStyle(style.badInput);
    }
  };
  const confirmPasswordLostFocus = () => {
    if (confirmPassword == password) {
      console.log("confirm is good");
      setConfirmPasswordStyle(style.input);
      setConfirmPasswordText("");
    } else {
      alert("Doesn't match password");
      setConfirmPasswordText("Doesn't match password");
      setConfirmPasswordStyle(style.badInput);
    }
  };
  const handleLogin = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log("signed in!");
        console.log(userCredential.user.uid);
        const newUserData = {
          img: "../assets/default-profile-image.jpg",
          username: username,
          displayName: username,
          id: username.toLowerCase(),
          birthdate: date,
          email: email.toLowerCase(),
          id: userCredential.user.uid,
          pushToken: pushToken,
        };
        await firebase.createUser(newUserData);
        navigation.navigate("PersonalData");
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };
  return (
    <View className="justify-center" style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View
        className={`mx-6 rounded-xl p-4 ${ResponsiveShadow}`}
        style={{ backgroundColor: appStyle.color_primary, shadowColor: "#000" }}
      >
        <View className="mb-8 items-center">
          <View className="items-center">
            {/* <TouchableOpacity onPress={openImageLibrary} className="mb-5">
              {image != null && (
                <Image
                  source={{ uri: image }}
                  className="w-28 h-28 bg-white aspect-square rounded-full"
                ></Image>
              )}
              {image == null && (
                <View>
                  <FontAwesomeIcon
                    icon={faCircleUser}
                    size={80}
                    color={appStyle.color_on_primary}
                  />
                  <View
                    className="rounded-full items-center absolute right-0 bottom-0"
                    style={{ backgroundColor: appStyle.color_on_primary }}
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      size={25}
                      color={appStyle.color_primary}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity> */}

            {/* <Text style={{ color: appStyle.color_on_primary }}>
              Click to add profile picture
            </Text> */}
            <Text
              className="text-3xl tracking-widest"
              style={{ color: appStyle.color_on_primary }}
            >
              Register
            </Text>
          </View>
        </View>
        <View className="flex-1 justify-between">
          <View>
            <TextInput
              onBlur={emailLostFocus}
              className="rounded mb-5 px-3 h-10 justify-center"
              style={emailStyle}
              placeholder="Email"
              placeholderTextColor={"#5f6b8b"}
              onChangeText={(text) => setEmail(text)}
            ></TextInput>
            <TextInput
              onBlur={usernameLostFocus}
              className="rounded mb-5 px-3 h-10 justify-center"
              style={usernameStyle}
              placeholder="Username (Must be unique)"
              placeholderTextColor={"#5f6b8b"}
              onChangeText={(text) => setUsername(text)}
            ></TextInput>
            {/* <TextInput
              className="rounded mb-5 px-3 h-10 justify-center"
              style={style.input}
              placeholder="Display name"
              placeholderTextColor={"#5f6b8b"}
              onChangeText={(text) => setDisplayName(text)}
            ></TextInput> */}
            <TouchableOpacity
              className="rounded mb-5 px-3 h-10 justify-center"
              style={dateStyle}
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
              style={passwordStyle}
              placeholder="Password"
              placeholderTextColor={"#5f6b8b"}
              onChangeText={(text) => setPassword(text)}
              onBlur={passwordLostFocus}
            ></TextInput>
            <TextInput
              className="rounded mb-3 px-3 h-10 justify-center"
              secureTextEntry={true}
              style={confirmPasswordStyle}
              placeholder="Confirm Password"
              placeholderTextColor={"#5f6b8b"}
              onChangeText={(text) => setConfirmPassword(text)}
              onBlur={confirmPasswordLostFocus}
            ></TextInput>
          </View>
          <View>
            <View className="flex-row items-center mb-5">
              <CheckBox
                backgroundColor={appStyle.color_on_primary}
                valueColor={appStyle.color_primary}
                value={false}
                onValueChange={setAcceptTerms}
              />
              <Text
                className="ml-2"
                style={{ color: appStyle.color_on_primary }}
              >
                {"I agree to the "}
              </Text>
              <Text
                className="font-semibold underline"
                style={{ color: appStyle.color_on_primary }}
              >
                Terms and Conditions
              </Text>
            </View>
            <Text
              className="text-center mt-4 mb-2"
              style={{
                color: appStyle.color_on_primary,
              }}
            >
              {inputErrorText}
            </Text>
            <TouchableOpacity
              onPress={handleCreateAccount}
              className={`flex-1 rounded p-2 justify-center ${ResponsiveShadow} mt-5 mb-10`}
              style={{
                backgroundColor: appStyle.color_bg,
                shadowColor: appStyle.color_bg,
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
    </View>
  );
};

export default LoginScreen;
const style = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderColor: appStyle.color_bg,
    color: appStyle.color_primary,
    backgroundColor: appStyle.color_on_primary,
  },
  badInput: {
    borderWidth: 2,
    borderColor: appStyle.color_error,
    color: appStyle.color_primary,
    backgroundColor: appStyle.color_on_primary,
  },
});
