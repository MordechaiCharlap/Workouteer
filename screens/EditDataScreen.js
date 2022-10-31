import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../components/AppStyleSheet";
import { useState } from "react";
import { useContext } from "react";
import authContext from "../context/authContext";
import * as firebase from "../services/firebase";
const EditDataScreen = () => {
  const { user, setUser } = useContext(authContext);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [description, setDescription] = useState(user.description);
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState("ProfileData");
  const [isLoading, setLoading] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const onImageLibraryPress = async () => {};
  const saveProfileChanges = async () => {
    setLoading(true);
    if (displayName == "") setDisplayName(user.username);
    await firebase.saveProfileChanges(
      user.usernameLower,
      displayName == null ? "" : displayName,
      description == null ? "" : description
    );
    setUser(await firebase.updateContext(user.usernameLower));
    setLoading(false);
  };
  const renderChosenSection = () => {
    if (currentTab == "ProfileData")
      return (
        <View>
          <View></View>
          <View>
            <View className="mb-5 self-center">
              <Image
                source={{
                  uri: user.img,
                }}
                className="h-32 w-32 bg-white rounded-full mb-2"
              />
              <TouchableOpacity
                onPress={onImageLibraryPress}
                className="absolute right-0 bottom-0 rounded-full p-2"
                style={{
                  backgroundColor: appStyle.appGray,
                  borderWidth: 1,
                  borderColor: appStyle.appDarkBlue,
                }}
              >
                <FontAwesomeIcon
                  icon={faPen}
                  size={20}
                  color={appStyle.appDarkBlue}
                />
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center mb-5">
              <Text
                className="mr-3 text-lg"
                style={{ color: appStyle.appGray }}
              >
                Display name:
              </Text>
              <TextInput
                className="rounded text-lg flex-1"
                style={style.input}
                placeholder={user.displayName}
                placeholderTextColor={"#5f6b8b"}
                maxLength={10}
                onChangeText={(text) => setDisplayName(text)}
              >
                {user.displayName}
              </TextInput>
            </View>
            <View className="mb-5">
              <Text
                className="mr-3 text-lg"
                style={{ color: appStyle.appGray }}
              >
                Description
              </Text>
              <TextInput
                style={{
                  textAlignVertical: "top",
                  backgroundColor: appStyle.appLightBlue,
                  borderRadius: 8,
                  padding: 8,
                }}
                multiline
                placeholder="Optional text"
                placeholderTextColor={appStyle.appDarkBlue}
                numberOfLines={12}
                maxLength={350}
                onChangeText={(text) => setDescription(text)}
              >
                {user.description}
              </TextInput>
            </View>
            <TouchableOpacity
              onPress={saveProfileChanges}
              className="self-center py-1 px-5"
              style={{ backgroundColor: appStyle.appAzure }}
            >
              <Text className="text-2xl" style={{ color: appStyle.appGray }}>
                {isLoading == false ? "Save" : "Loading"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    else return <View></View>;
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1  p-3">
        <View className="flex-row justify-around mb-8">
          <TouchableOpacity
            onPress={() => setCurrentTab("ProfileData")}
            className="w-1/2"
            style={{
              backgroundColor:
                currentTab == "ProfileData"
                  ? appStyle.appDarkBlue
                  : appStyle.appLightBlue,
            }}
          >
            <Text
              className="text-lg text-center"
              style={{
                color:
                  currentTab == "ProfileData"
                    ? appStyle.appGray
                    : appStyle.appDarkBlue,
              }}
            >
              Profile data
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCurrentTab("WorkoutPreferences")}
            className="w-1/2"
            style={{
              backgroundColor:
                currentTab == "WorkoutPreferences"
                  ? appStyle.appDarkBlue
                  : appStyle.appLightBlue,
            }}
          >
            <Text
              className="text-lg text-center"
              style={{
                color:
                  currentTab == "WorkoutPreferences"
                    ? appStyle.appGray
                    : appStyle.appDarkBlue,
              }}
            >
              Workout preferences
            </Text>
          </TouchableOpacity>
        </View>
        {renderChosenSection()}
      </View>
    </SafeAreaView>
  );
};
export default EditDataScreen;
const style = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#5f6b8b",
    color: appStyle.appGray,
  },
});
