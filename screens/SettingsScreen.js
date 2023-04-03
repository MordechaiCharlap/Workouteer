import {
  Text,
  View,
  TouchableOpacity,
  Switch,
  StatusBar,
  Modal,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as appStyle from "../components/AppStyleSheet";
import responsiveStyle from "../components/ResponsiveStyling";
import { saveSettingsChanges } from "../services/firebase";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import languageService from "../services/languageService";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { doc, updateDoc, deleteDoc } from "@firebase/firestore";
import { db } from "../services/firebase";
import { UserDeleted } from "../components/settingsScreen/UserDeleted";
const SettingsScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const [isDeleted, setIsDeleted] = useState(user.isDeleted);
  const { user, setUser, userSignOut } = useAuth();
  const [changesMade, setChangesMade] = useState(false);
  const [isPublic, setIsPublic] = useState(user.isPublic);
  const [showOnline, setShowOnline] = useState(user.showOnline);
  const [language, setLanguage] = useState(user.language);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
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
    setIsDeleted( true );
  };
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      {isDeleted ? (
        <UserDeleted id={user.id} />
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
                  Delete User
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity className="w-5/12">
            <Text
              className="text-center py-1 px-1"
              style={{
                backgroundColor: appStyle.color_primary,
                color: appStyle.color_on_primary,
              }}
            >
              {languageService[user.language].changePassword}
            </Text>
          </TouchableOpacity> */}
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
            <Modal
              className="justify-center"
              animationType="slide"
              transparent={true}
              visible={showDeleteUserModal}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setShowDeleteUserModal(!showDeleteUserModal);
              }}
            >
              <View className="flex-1">
                <View className="bg-black opacity-80 flex-1 justify-center ">
                  <View
                    style={{ backgroundColor: appStyle.color_bg_variant }}
                    className="p-3 rounded mx-3 gap-y-3"
                  >
                    <Text
                      className="text-center font-semibold text-2xl"
                      style={{ color: appStyle.color_on_primary }}
                    >
                      Are you sure?
                    </Text>
                    <View className="flex-row justify-between">
                      <TouchableOpacity
                        className="flex-1 m-1 p-2 rounded"
                        onPress={async () => await deleteUser()}
                        style={{ backgroundColor: appStyle.color_primary }}
                      >
                        <Text
                          className="text-center font-semibold text-lg"
                          style={{ color: appStyle.color_on_primary }}
                        >
                          Yes
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1 m-1 p-2 rounded"
                        onPress={() =>
                          setShowDeleteUserModal(!showDeleteUserModal)
                        }
                        style={{ backgroundColor: appStyle.color_primary }}
                      >
                        <Text
                          className="text-center font-semibold text-lg"
                          style={{ color: appStyle.color_on_primary }}
                        >
                          No
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
            <View className="absolute bottom-8 right-0 left-0 items-center">
              <TouchableOpacity
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
    </View>
  );
};

export default SettingsScreen;
