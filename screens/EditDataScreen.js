import {
  StatusBar,
  Text,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

import React, { useLayoutEffect, useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useNavigation } from "@react-navigation/native";
import responsiveStyle from "../components/ResponsiveStyling";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import CheckBox from "../components/CheckBox";
import useAuth from "../hooks/useAuth";
import * as defaultValues from "../services/defaultValues";
import Header from "../components/Header";
const EditDataScreen = () => {
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState("ProfileData");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Header title={"Edit personal data"} goBackOption={true} />
      <View className="flex-1 p-4">
        <EditProfileData navigation={navigation} />
        {/* <View className="flex-row justify-around mb-8">
          <TouchableOpacity
            onPress={() => setCurrentTab("ProfileData")}
            className="w-1/2"
          >
            <Text
              className="text-lg text-center"
              style={
                currentTab == "ProfileData" ? style.currentTab : style.otherTab
              }
            >
              Profile data
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCurrentTab("WorkoutPreferences")}
            className="w-1/2"
          >
            <Text
              className="text-lg text-center"
              style={
                currentTab == "WorkoutPreferences"
                  ? style.currentTab
                  : style.otherTab
              }
            >
              Workout preferences
            </Text>
          </TouchableOpacity>
        </View>
        {currentTab == "ProfileData" && (
          <EditProfileData
            user={user}
            setUser={setUser}
            navigation={navigation}
          />
        )}
        {currentTab == "WorkoutPreferences" && (
          <EditWorkoutPreferences
            user={user}
            setUser={setUser}
            navigation={navigation}
          />
        )} */}
      </View>
    </View>
  );
};
export default EditDataScreen;
const EditWorkoutPreferences = (props) => {
  const [minAge, setMinAge] = useState(props.user.acceptMinAge);
  const [maxAge, setMaxAge] = useState(props.user.acceptMaxAge);
  const [acceptMale, setAcceptMale] = useState(props.user.acceptMale);
  const [acceptFemale, setAcceptFemale] = useState(props.user.acceptFemale);

  const [invalidInput, setInvalidInput] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const onChangedMinAge = (text) => {
    setMinAge(text.replace(/[^0-9]/g, ""));
  };
  const onChangedMaxAge = (text) => {
    setMaxAge(text.replace(/[^0-9]/g, ""));
  };
  useEffect(() => {
    if (
      minAge == "" ||
      maxAge == "" ||
      parseInt(minAge) > parseInt(maxAge) ||
      (acceptMale == false && acceptFemale == false)
    ) {
      setInvalidInput(true);
    } else setInvalidInput(false);
    if (
      minAge != props.user.acceptMinAge ||
      maxAge != props.user.acceptMaxAge ||
      acceptMale != props.user.acceptMale ||
      acceptFemale != props.user.acceptFemale
    ) {
      setChangesMade(true);
    } else setChangesMade(false);
  }, [minAge, maxAge, acceptFemale, acceptMale]);
  const savePreferencesChanges = async () => {
    setLoading(true);
    await firebase.savePreferencesChanges(
      props.user.id,
      Math.max(parseInt(minAge), 16).toString(),
      Math.min(parseInt(maxAge), 100).toString(),
      acceptMale,
      acceptFemale
    );
    props.setUser(await firebase.updateContext(props.user.id));

    setUpdated(true);
    setTimeout(() => {
      setLoading(false);
      setChangesMade(false);
      setUpdated(false);
      props.navigation.navigate("MyUser");
    }, 1000);
  };
  const saveButtonClicked = () => {
    if (!invalidInput) {
      if (changesMade == true) {
        if (isLoading == false) savePreferencesChanges();
      }
    }
  };
  const SaveButton = () => {
    const getBackgroundColor = () => {
      if (invalidInput || !changesMade) return appStyle.color_bg_variant;
      return updated == false
        ? appStyle.color_primary
        : appStyle.color_bg_variant;
    };
    return (
      <TouchableOpacity
        onPress={saveButtonClicked}
        className="self-center py-1 px-5 w-9/12 rounded"
        style={{
          backgroundColor: getBackgroundColor(),
        }}
      >
        <Text
          className="text-2xl text-center"
          style={{ color: appStyle.color_on_primary }}
        >
          {invalidInput == true && "Invalid input"}
          {invalidInput == false && updated == true && "Updated successfuly!"}
          {invalidInput == false &&
            updated == false &&
            changesMade == false &&
            "No changes made"}
          {invalidInput == false &&
            updated == false &&
            changesMade == true &&
            isLoading == false &&
            "Save Changes"}
          {invalidInput == false &&
            updated == false &&
            changesMade == true &&
            isLoading == true &&
            "Loading"}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <View className="flex-row mb-5">
        <Text
          className="text-xl font-semibold mr-2"
          style={{ color: appStyle.color_primary }}
        >
          Partner's age:
        </Text>
        <TextInput
          keyboardType="numeric"
          className="rounded text-lg px-2 text-center w-16"
          style={style.input}
          maxLength={3}
          onChangeText={(text) => onChangedMinAge(text)}
          onBlur={() => {
            if (minAge != "")
              setMinAge(
                Math.min(Math.max(parseInt(minAge), 16), maxAge).toString()
              );
          }}
          value={minAge}
        ></TextInput>
        <Text
          className="text-xl font-semibold mx-3"
          style={{ color: appStyle.color_primary }}
        >
          -
        </Text>
        <TextInput
          keyboardType="numeric"
          className="rounded text-lg px-2 text-center w-16"
          style={style.input}
          maxLength={3}
          onChangeText={(text) => onChangedMaxAge(text)}
          onBlur={() => {
            if (maxAge != "")
              setMaxAge(
                Math.max(Math.min(parseInt(maxAge), 100), minAge).toString()
              );
          }}
          value={maxAge}
        ></TextInput>
      </View>
      <View className="flex-row items-center mb-5">
        <Text
          className="text-xl font-semibold mr-2"
          style={{ color: appStyle.color_primary }}
        >
          Partner's sex:
        </Text>
        <View className="flex-row items-center mr-2">
          <CheckBox
            onValueChange={(value) => setAcceptMale(value)}
            backgroundColor={appStyle.color_primary}
            valueColor={appStyle.color_on_primary}
            value={acceptMale}
          />
          <Text className="ml-1" style={{ color: appStyle.color_primary }}>
            Male
          </Text>
        </View>
        <View className="flex-row items-center">
          <CheckBox
            onValueChange={(value) => setAcceptFemale(value)}
            backgroundColor={appStyle.color_primary}
            valueColor={appStyle.color_on_primary}
            value={acceptFemale}
          />
          <Text className="ml-1" style={{ color: appStyle.color_primary }}>
            Female
          </Text>
        </View>
      </View>
      {SaveButton()}
    </View>
  );
};
const EditProfileData = (props) => {
  const { user, setUser } = useAuth();
  const [displayName, setDisplayName] = useState(user.displayName);
  const [description, setDescription] = useState(user.description);
  const [image, setImage] = useState(user.img);
  useEffect(() => {
    if (
      description == user.description &&
      displayName == user.displayName &&
      image == user.img
    )
      setChangesMade(false);
    else setChangesMade(true);
  }, [displayName, description, image]);
  const [updated, setUpdated] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const onImageLibraryPress = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
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
        user.id,
        manipResult.uri
      );
      console.log("uploadUrl: " + uploadUrl);
      setImage(uploadUrl);
    }
  };
  const saveProfileChanges = async () => {
    setLoading(true);
    if (displayName == "") setDisplayName(user.username);
    await firebase.saveProfileChanges(
      user.id,
      displayName == null ? "" : displayName,
      description == null ? "" : description,
      image == null ? defaultValues.defaultProfilePic : image
    );
    setUser(await firebase.updateContext(user.id));

    setUpdated(true);
    setTimeout(() => {
      setLoading(false);
      setChangesMade(false);
      setUpdated(false);
      props.navigation.navigate("MyUser");
    }, 500);
  };

  const saveButtonClicked = () => {
    if (changesMade == true) {
      if (isLoading == false) saveProfileChanges();
    }
  };
  const SaveButton = () => {
    return (
      <TouchableOpacity
        onPress={saveButtonClicked}
        className="self-center py-1 px-5 w-9/12 rounded"
        style={{
          backgroundColor:
            updated == false ? appStyle.color_primary : appStyle.color_primary,
        }}
      >
        <Text
          className="text-2xl text-center"
          style={{ color: appStyle.color_on_primary }}
        >
          {updated == true && "Updated successfuly!"}
          {updated == false && changesMade == false && "No changes made"}
          {updated == false &&
            changesMade == true &&
            isLoading == false &&
            "Save Changes"}
          {updated == false &&
            changesMade == true &&
            isLoading == true &&
            "Loading"}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <View className="mb-5 self-center">
        <Image
          source={{
            uri: image,
          }}
          className="h-32 w-32 bg-white rounded-full mb-2"
          style={{ borderWidth: 1, borderColor: appStyle.color_primary }}
        />
        <TouchableOpacity
          onPress={onImageLibraryPress}
          className="absolute right-0 bottom-0 rounded-full p-2"
          style={{
            backgroundColor: appStyle.color_primary,
            borderColor: appStyle.color_bg,
            borderWidth: 3,
          }}
        >
          <FontAwesomeIcon
            icon={faPen}
            size={20}
            color={appStyle.color_on_primary}
          />
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center mb-5">
        <Text
          className="mr-3 text-lg"
          style={{ color: appStyle.color_primary }}
        >
          Display name:
        </Text>
        <TextInput
          className="rounded text-lg flex-1 px-2"
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
          style={{ color: appStyle.color_primary }}
        >
          Description
        </Text>
        <TextInput
          style={{
            textAlignVertical: "top",
            color: appStyle.color_on_primary,
            backgroundColor: appStyle.color_bg_variant,
            borderRadius: 8,
            padding: 8,
          }}
          multiline
          placeholder="Optional text"
          placeholderTextColor={appStyle.color_primary}
          numberOfLines={12}
          maxLength={350}
          onChangeText={(text) => setDescription(text)}
        >
          {user.description}
        </TextInput>
      </View>
      {SaveButton()}
    </View>
  );
};
const style = StyleSheet.create({
  input: {
    backgroundColor: appStyle.color_bg_variant,
    borderWidth: 1,
    borderColor: appStyle.color_primary,
    color: appStyle.color_on_primary,
  },
  currentTab: {
    color: appStyle.color_primary,
    textDecorationLine: "underline",
  },
  otherTab: {
    color: appStyle.color_on_primary,
    backgroundColor: appStyle.color_primary_variant,
  },
});
