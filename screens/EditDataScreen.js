import {
  Text,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import React, { useState, useEffect, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../utils/appStyleSheet";
import * as firebase from "../services/firebase";
import CheckBox from "../components/CheckBox";
import useAuth from "../hooks/useAuth";
import * as defaultValues from "../utils/defaultValues";
import Header from "../components/Header";
import languageService from "../services/languageService";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import CustomButton from "../components/basic/CustomButton";
import CustomModal from "../components/basic/CustomModal";
import CustomText from "../components/basic/CustomText";
import { doc, updateDoc } from "firebase/firestore";
import useFirebase from "../hooks/useFirebase";

const EditDataScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Chat");
    }, [])
  );
  const navigation = useNavigation();
  const { user } = useAuth();
  return (
    <View style={safeAreaStyle()}>
      <Header
        title={languageService[user.language].editPersonalData}
        goBackOption={true}
      />
      <View
        className="flex-1"
        style={{ paddingHorizontal: 16, paddingBottom: 10 }}
      >
        <EditProfileData navigation={navigation} user={user} />
      </View>
    </View>
  );
};
export default EditDataScreen;

const EditProfileData = (props) => {
  const { db } = useFirebase();
  const { user, setUser } = useAuth();
  const [displayName, setDisplayName] = useState(user.displayName);
  const [description, setDescription] = useState(user.description);
  const [image, setImage] = useState(user.img);
  const [imageLoading, setImageLoading] = useState(false);
  const [showAddOrDeleteImageModal, setShowAddOrDeleteImageModal] =
    useState(false);
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
  const editProfileImageClicked = () => {
    if (image != defaultValues.defaultProfilePic) {
      setShowAddOrDeleteImageModal(true);
    } else {
      onImageLibraryPress();
    }
  };
  const onImageLibraryPress = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImageLoading(true);
      const manipResult = await ImageManipulator.manipulateAsync(
        result.localUri || result.assets[0].uri,
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
      setImage(uploadUrl);
    }
    setImageLoading(false);
  };
  const deleteProfileImage = () => {
    setImage(defaultValues.defaultProfilePic);
  };
  const saveProfileChanges = () => {
    setLoading(true);
    if (displayName == "") setDisplayName(user.id);
    const newData = {
      displayName: displayName || user.id,
      description: description || "",
      img: image || defaultValues.defaultProfilePic,
    };
    const userClone = {
      ...user,
      ...newData,
    };
    setUser(userClone);
    setUpdated(true);
    setTimeout(() => {
      props.navigation.navigate("MyProfile");
      setLoading(false);
      setChangesMade(false);
      setUpdated(false);
    }, 250);
    updateDoc(doc(db, `users/${user.id}`), {
      ...newData,
    });
  };

  const saveButtonClicked = () => {
    if (changesMade == true) {
      if (isLoading == false) saveProfileChanges();
    }
  };
  const SaveButton = () => {
    return (
      <CustomButton
        onPress={saveButtonClicked}
        style={{
          borderRadius: 999,
          backgroundColor: !changesMade
            ? appStyle.color_surface_variant
            : appStyle.color_on_background,
        }}
      >
        <Text
          className="text-2xl text-center"
          style={{
            color: !changesMade
              ? appStyle.color_on_surface_variant
              : appStyle.color_background,
          }}
        >
          {updated == true && languageService[user.language].changesSaved}
          {updated == false &&
            changesMade == false &&
            languageService[user.language].noChangesWereMade}
          {updated == false &&
            changesMade == true &&
            isLoading == false &&
            languageService[user.language].applyChanges}
          {updated == false &&
            changesMade == true &&
            isLoading == true &&
            languageService[user.language].loading}
        </Text>
      </CustomButton>
    );
  };
  return (
    <View className="flex-1">
      <ScrollView scrollEnabled={false} showsVerticalScrollIndicator={false}>
        <View className="mb-5 self-center">
          {imageLoading ? (
            <View
              className="h-32 w-32 rounded-full mb-2 items-center justify-center"
              style={{
                borderWidth: 1,
                borderColor: appStyle.color_outline,
                backgroundColor: appStyle.color_background,
              }}
            >
              <Text
                className="text-xl font-bold"
                style={{ color: appStyle.color_on_background }}
              >
                {languageService[user.language].loading}
              </Text>
            </View>
          ) : (
            <Image
              source={{
                uri: image,
              }}
              className="h-32 w-32 bg-white rounded-full mb-2"
              style={{ borderWidth: 1, borderColor: appStyle.color_outline }}
            />
          )}
          <TouchableOpacity
            onPress={editProfileImageClicked}
            className="absolute right-0 bottom-0 rounded-full p-2"
            style={{
              backgroundColor: appStyle.color_on_background,
              borderColor: appStyle.color_background,
              borderWidth: 3,
            }}
          >
            <FontAwesomeIcon
              icon={faPen}
              size={20}
              color={appStyle.color_background}
            />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS == "android" ? "padding" : "padding"}
          enabled={true}
          keyboardVerticalOffset={-200}
        >
          <View
            className={`items-center mb-5 gap-x-3 ${
              user.language == "hebrew" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <Text
              className="text-lg"
              style={{ color: appStyle.color_on_background }}
            >
              {languageService[user.language].displayName}:
            </Text>
            <TextInput
              className="rounded text-lg flex-1 px-2"
              style={style.input}
              placeholder={user.displayName}
              placeholderTextColor={"#5f6b8b"}
              maxLength={20}
              onChangeText={(text) => setDisplayName(text)}
              value={displayName}
            />
          </View>
          <View className="mb-5">
            <Text
              className="text-lg"
              style={{ color: appStyle.color_on_background }}
            >
              {languageService[user.language].description}:
            </Text>
            <TextInput
              style={{
                textAlignVertical: "top",
                color: appStyle.color_on_surface,
                backgroundColor: appStyle.color_surface,
                borderRadius: 4,
                padding: 8,
                borderWidth: 1,
                borderColor: appStyle.color_outline,
              }}
              multiline
              spellCheck={false}
              autoCorrect={false}
              placeholder={languageService[user.language].optionalText}
              placeholderTextColor={appStyle.color_on_surface_variant}
              numberOfLines={12}
              maxLength={350}
              onChangeText={(text) => setDescription(text)}
              value={description}
            />
          </View>
          {SaveButton()}
        </KeyboardAvoidingView>
      </ScrollView>
      <CustomModal
        showModal={showAddOrDeleteImageModal}
        setShowModal={setShowAddOrDeleteImageModal}
        closeOnTouchOutside
        style={{ rowGap: 10 }}
      >
        <View
          className="flex-row justify-center items-center"
          style={{ columnGap: 10 }}
        >
          <CustomButton
            onPress={() => {
              setShowAddOrDeleteImageModal(false);
              onImageLibraryPress();
            }}
            round
            className="flex-row"
            style={{
              backgroundColor: appStyle.color_on_background,
              columnGap: 5,
            }}
          >
            <FontAwesomeIcon icon={faPen} color={appStyle.color_background} />
            <CustomText style={{ color: appStyle.color_background }}>
              {languageService[user.language].edit}
            </CustomText>
          </CustomButton>
          <CustomButton
            onPress={() => {
              setShowAddOrDeleteImageModal(false);
              deleteProfileImage();
            }}
            round
            className="flex-row"
            style={{ backgroundColor: appStyle.color_on_background }}
          >
            <FontAwesomeIcon icon={faTrash} color={appStyle.color_background} />
            <CustomText
              style={{ color: appStyle.color_background, columnGap: 5 }}
            >
              {languageService[user.language].delete}
            </CustomText>
          </CustomButton>
        </View>
      </CustomModal>
    </View>
  );
};

const style = StyleSheet.create({
  input: {
    color: appStyle.color_on_surface,
    backgroundColor: appStyle.color_surface,
    borderWidth: 1,
    borderColor: appStyle.color_outline,
  },
  currentTab: {
    color: appStyle.color_on_background,
    textDecorationLine: "underline",
  },
  otherTab: {
    color: appStyle.color_on_primary,
    backgroundColor: appStyle.color_on_background,
  },
});
