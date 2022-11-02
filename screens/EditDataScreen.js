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
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../components/AppStyleSheet";
import { useState } from "react";
import { useContext } from "react";
import authContext from "../context/authContext";
import * as firebase from "../services/firebase";
import { useEffect } from "react";
const EditDataScreen = () => {
  const navigation = useNavigation();

  const { user, setUser } = useContext(authContext);

  const [currentTab, setCurrentTab] = useState("ProfileData");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1  p-3">
        <View className="flex-row justify-around mb-8">
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
          <EditProfileData user={user} setUser={setUser} />
        )}
      </View>
    </SafeAreaView>
  );
};
export default EditDataScreen;

const EditProfileData = (props) => {
  useEffect(() => {
    console.log("checking if changes were made");
    if (
      description == props.user.description &&
      displayName == props.user.displayName &&
      image == props.user.img
    )
      setChangesMade(false);
    else setChangesMade(true);
  });
  const [displayName, setDisplayName] = useState(props.user.displayName);
  const [description, setDescription] = useState(props.user.description);
  const [image, setImage] = useState(props.user.img);

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
        [
          { resize: { height: 1080, width: 1080 } },
          { flip: ImageManipulator.FlipType.Vertical },
        ],
        {
          compress: 0.5,
          height: 1080,
          width: 1080,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      setImage(manipResult.uri);
      const uploadUrl = await firebase.uploadProfileImage(
        props.user.usernameLower,
        result.uri
      );
      console.log("uploadUrl: " + uploadUrl);
      setImage(manipResult.uri);
    }
  };
  const saveProfileChanges = async () => {
    setLoading(true);
    if (displayName == "") setDisplayName(props.user.username);
    await firebase.saveProfileChanges(
      props.user.usernameLower,
      displayName == null ? "" : displayName,
      description == null ? "" : description,
      image == null ? "" : image
    );
    props.setUser(await firebase.updateContext(props.user.usernameLower));

    setUpdated(true);
    setTimeout(() => {
      setLoading(false);
      setChangesMade(false);
      setUpdated(false);
    }, 2000);
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
          backgroundColor: updated == false ? appStyle.appAzure : "#28a923",
        }}
      >
        <Text
          className="text-2xl text-center"
          style={{ color: appStyle.appGray }}
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
        <Text className="mr-3 text-lg" style={{ color: appStyle.appGray }}>
          Display name:
        </Text>
        <TextInput
          className="rounded text-lg flex-1"
          style={style.input}
          placeholder={props.user.displayName}
          placeholderTextColor={"#5f6b8b"}
          maxLength={10}
          onChangeText={(text) => setDisplayName(text)}
        >
          {props.user.displayName}
        </TextInput>
      </View>
      <View className="mb-5">
        <Text className="mr-3 text-lg" style={{ color: appStyle.appGray }}>
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
          {props.user.description}
        </TextInput>
      </View>
      {SaveButton()}
    </View>
  );
};
const style = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#5f6b8b",
    color: appStyle.appGray,
  },
  currentTab: {
    color: appStyle.appGray,
    textDecorationLine: "underline",
  },
  otherTab: {
    color: appStyle.appDarkBlue,
    backgroundColor: appStyle.appLightBlue,
  },
});
