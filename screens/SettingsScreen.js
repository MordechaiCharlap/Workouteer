import {
  Text,
  View,
  TouchableOpacity,
  Switch,
  StatusBar,
  Modal,
} from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as appStyle from "../utilities/appStyleSheet";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { saveSettingsChanges } from "../services/firebase";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import languageService from "../services/languageService";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { UserDeleted } from "../components/settingsScreen/UserDeleted";
import SuggestionForm from "../components/SuggestionForm";
const SettingsScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { user, userSignOut } = useAuth();
  const [changesMade, setChangesMade] = useState(false);
  const [isPublic, setIsPublic] = useState(user.isPublic);
  const [showOnline, setShowOnline] = useState(user.showOnline);
  const [language, setLanguage] = useState(user.language);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const navigation = useNavigation();
  const signOut = async () => {
    console.log("Signing out");
    await updateDoc(doc(db, "users", user.id), {
      pushToken: null,
    });
    userSignOut();
  };
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Settings");
    }, [])
  );
  useEffect(() => {
    if (
      user.isPublic != isPublic ||
      user.showOnline != showOnline ||
      language != user.language
    ) {
      setChangesMade(true);
    } else {
      setChangesMade(false);
    }
  }, [isPublic, showOnline, language]);
  const applyChanges = async () => {
    if (changesMade) {
      await saveSettingsChanges(user.id, isPublic, showOnline, language);
      navigation.goBack();
    }
  };
  const deleteUser = async () => {
    user.isDeleted = true;
    setTimeout(async () => {
      userSignOut();
      await deleteDoc(doc(db, `alerts/${user.id}`));
    }, 3000);
  };
  return (
    <View style={safeAreaStyle()}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      {user.isDeleted ? (
        <UserDeleted id={user.id} language={language} />
      ) : (
        <>
          <View className="flex-1 p-4">
            <Header
              title={languageService[user.language].settings}
              goBackOption={true}
            />
            <Text
              className="text-center"
              style={{ color: appStyle.color_primary }}
            >
              {languageService[user.language].privacy}
            </Text>
            <View
              className={`justify-between items-center h-10 ${
                user.language == "hebrew" ? "flex-row-reverse" : "flex-row"
              }`}
              style={{ color: appStyle.color_primary }}
            >
              <Text style={{ color: appStyle.color_primary }}>
                {languageService[user.language].publicAccount}:
              </Text>
              <Switch
                trackColor={{ false: "#767577", true: appStyle.color_primary }}
                thumbColor={"#f4f3f4"}
                value={isPublic}
                onValueChange={() => setIsPublic((prev) => !prev)}
              />
            </View>
            <View
              className={`justify-between items-center h-10 ${
                user.language == "hebrew" ? "flex-row-reverse" : "flex-row"
              }`}
              style={{ color: appStyle.color_primary }}
            >
              <Text style={{ color: appStyle.color_primary }}>
                {languageService[user.language].showOnlineStatus}:
              </Text>
              <Switch
                trackColor={{ false: "#767577", true: appStyle.color_primary }}
                thumbColor={"#f4f3f4"}
                value={showOnline}
                onValueChange={() => setShowOnline((prev) => !prev)}
              />
            </View>
            <View
              className={`justify-between items-center h-10 ${
                user.language == "hebrew" ? "flex-row-reverse" : "flex-row"
              }`}
              style={{ color: appStyle.color_primary }}
            >
              <Text style={{ color: appStyle.color_primary }}>
                {languageService[user.language].chooseLanguage}:
              </Text>
              <View className="flex-row gap-x-2">
                <TouchableOpacity
                  disabled={language == "hebrew"}
                  onPress={() => setLanguage("hebrew")}
                  style={{
                    backgroundColor:
                      language == "hebrew"
                        ? appStyle.color_lighter
                        : appStyle.color_primary,
                  }}
                  className="py-1 px-2"
                >
                  <Text
                    style={{
                      color:
                        language == "hebrew"
                          ? "gray"
                          : appStyle.color_on_primary,
                    }}
                  >
                    עברית
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={language == "english"}
                  onPress={() => setLanguage("english")}
                  style={{
                    backgroundColor:
                      language == "english"
                        ? appStyle.color_lighter
                        : appStyle.color_primary,
                  }}
                  className="py-1 px-2"
                >
                  <Text
                    style={{
                      color:
                        language == "english"
                          ? "gray"
                          : appStyle.color_on_primary,
                    }}
                  >
                    English
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-row items-center justify-between mt-5">
              <TouchableOpacity
                className="w-5/12"
                onPress={() => setShowDeleteUserModal(!showDeleteUserModal)}
              >
                <Text
                  className="text-center py-1 px-1"
                  style={{
                    backgroundColor: appStyle.color_primary,
                    color: appStyle.color_on_primary,
                  }}
                >
                  {languageService[user.language].deleteUser}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={signOut} className="w-5/12">
                <Text
                  className="text-center py-1 px-1"
                  style={{
                    backgroundColor: appStyle.color_primary,
                    color: appStyle.color_on_primary,
                  }}
                >
                  {languageService[user.language].logOut}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="absolute bottom-8 right-0 left-0 items-center">
              <TouchableOpacity
                onPress={() => setShowSuggestionForm(true)}
                style={{
                  backgroundColor: appStyle.color_primary,
                }}
                className="items-center rounded-xl p-3"
              >
                <FontAwesomeIcon
                  color={appStyle.color_on_primary}
                  icon={faBug}
                  size={30}
                />
              </TouchableOpacity>
              <Text
                className="text-lg text-center font-semibold"
                style={{
                  color: appStyle.color_primary,
                }}
              >
                {languageService[user.language].reportABug}
              </Text>
            </View>
          </View>
          <View
            style={{ backgroundColor: appStyle.color_primary }}
            className="h-16 p-2 justify-center items-center"
          >
            <TouchableOpacity
              onPress={applyChanges}
              className="bg-gray-100 p-1 rounded"
            >
              <Text
                className="text-xl text-center"
                style={{ color: appStyle.color_primary }}
              >
                {changesMade == false
                  ? languageService[user.language].noChangesWereMade
                  : languageService[user.language].applyChanges}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSuggestionForm}
        onRequestClose={() => {
          setShowSuggestionForm(!showSuggestionForm);
        }}
      >
        <SuggestionForm
          setShowSuggestionForm={setShowSuggestionForm}
          id={user.id}
          language={user.language}
          showSuggestionForm={showSuggestionForm}
        />
      </Modal>

      <AwesomeAlert
        overlayStyle={{
          width: safeAreaStyle().width,
          height: "100%",
        }}
        show={showDeleteUserModal}
        showProgress={false}
        title={"Are you sure?"}
        message={"Are you sure?"}
        closeOnTouchOutside={true}
        onDismiss={() => setShowDeleteUserModal(false)}
        closeOnHardwareBackPress={true}
        showConfirmButton={true}
        showCancelButton={true}
        confirmText="yes"
        cancelText="no"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          setShowDeleteUserModal(false);
        }}
        onConfirmPressed={async () => {
          setShowDeleteUserModal(false);
          await deleteUser();
        }}
      />
    </View>
  );
};

export default SettingsScreen;
