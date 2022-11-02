import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { React, useLayoutEffect, useState, useContext } from "react";
import * as ImagePicker from "expo-image-picker";
import CheckBox from "../components/CheckBox";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { ResponsiveShadow } from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { createUserWithEmailAndPassword } from "firebase/auth";
import * as firebase from "../services/firebase";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleUser, faPlus } from "@fortawesome/free-solid-svg-icons";
const LoginScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const auth = firebase.auth;
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [inputErrorText, setInputErrorText] = useState("");
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
  const openImageLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  const showDatepicker = () => {
    setShow(true);
  };
  const handleCreateAccount = async () => {
    setInputErrorText("");
    if (image != null) {
      if (changedOnce) {
        var age = calculateAge();
        var isUserAvailable = await firebase.checkUsername(username);
        var isEmailAvailable = await firebase.checkEmail(email);

        if (age >= 16) {
          if (username.length >= 6) {
            if (isUserAvailable) {
              console.log(username);
              if (isEmailAvailable) {
                console.log(email);
                if (acceptTerms) {
                  handleLogin();
                } else setInputErrorText("Accept terms before going further");
              } else setInputErrorText("email isnt available");
            } else setInputErrorText("Username isnt available");
          } else setInputErrorText("Username too small (6+ characters)");
        } else setInputErrorText("Need to be >=16");
      } else setInputErrorText("Choose birthdate");
    } else setInputErrorText("Upload a profile picture");
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
          img: image,
          username: username,
          displayName: displayName,
          usernameLower: username.toLowerCase(),
          birthdate: date,
          email: email.toLowerCase(),
          id: userCredential.user.uid,
        };
        await firebase.createUser(newUserData);
        await firebase.createUserRequestsDocs(newUserData);
        await firebase.uploadProfileImage(username.toLowerCase(), image);
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
        className={`flex-1 my-8 mx-6 rounded-xl p-4 ${ResponsiveShadow}`}
        style={{ backgroundColor: appStyle.appDarkBlue, shadowColor: "#000" }}
      >
        <View className="mb-8 items-center">
          <View className="items-center">
            <TouchableOpacity onPress={openImageLibrary} className="mb-5">
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
                    color={appStyle.appGray}
                  />
                  <View
                    className="rounded-full items-center absolute right-0 bottom-0"
                    style={{ backgroundColor: appStyle.appGray }}
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      size={25}
                      color={appStyle.appDarkBlue}
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>

            <Text style={{ color: appStyle.appGray }}>
              Click to add profile picture
            </Text>
          </View>
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
              className="rounded mb-3 px-3 h-10 justify-center"
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
            <Text
              className="text-center mt-4 mb-2"
              style={{ color: appStyle.appGray }}
            >
              {inputErrorText}
            </Text>
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
