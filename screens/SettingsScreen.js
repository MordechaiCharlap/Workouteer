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
import CustomText from "../components/basic/CustomText";
import CustomButton from "../components/basic/CustomButton";
const SettingsScreen = ({ route }) => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { user, userSignOut } = useAuth();
  const [changesMade, setChangesMade] = useState(false);
  const [isPublic, setIsPublic] = useState(user.isPublic);
  const [showOnline, setShowOnline] = useState(user.showOnline);
  const [language, setLanguage] = useState(user.language);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const navigation = useNavigation();
  const lastLanguage = route.params.language;
  const signOut = async () => {
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
      {user.isDeleted ? (
        <UserDeleted id={user.id} language={language} />
      ) : (
        <>
          <View className="flex-1 p-4">
            <Header
              title={languageService[lastLanguage].settings}
              goBackOption={true}
            />
            <CustomText
              className="text-center"
              style={{ color: appStyle.color_on_background }}
            >
              {languageService[lastLanguage].privacy}
            </CustomText>
            <View
              className={`justify-between items-center h-10 ${
                lastLanguage == "hebrew" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <CustomText style={{ color: appStyle.color_on_background }}>
                {languageService[lastLanguage].publicAccount}:
              </CustomText>
              <Switch
                trackColor={{
                  false: appStyle.color_surface_variant,
                  true: appStyle.color_primary,
                }}
                thumbColor={"#f4f3f4"}
                value={isPublic}
                onValueChange={() => setIsPublic((prev) => !prev)}
              />
            </View>
            <View
              className={`justify-between items-center h-10 ${
                lastLanguage == "hebrew" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <CustomText style={{ color: appStyle.color_on_background }}>
                {languageService[lastLanguage].showOnlineStatus}:
              </CustomText>
              <Switch
                trackColor={{
                  false: appStyle.color_surface_variant,
                  true: appStyle.color_primary,
                }}
                thumbColor={"#f4f3f4"}
                value={showOnline}
                onValueChange={() => setShowOnline((prev) => !prev)}
              />
            </View>
            <View
              className={`justify-between items-center h-10 ${
                lastLanguage == "hebrew" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <CustomText style={{ color: appStyle.color_on_background }}>
                {languageService[lastLanguage].chooseLanguage}:
              </CustomText>
              <View className="flex-row gap-x-2">
                <CustomButton
                  disabled={language == "hebrew"}
                  onPress={() => setLanguage("hebrew")}
                  style={{
                    backgroundColor:
                      language == "hebrew"
                        ? appStyle.color_surface_variant
                        : appStyle.color_on_background,
                  }}
                >
                  <CustomText
                    style={{
                      color:
                        language == "hebrew"
                          ? appStyle.color_on_surface_variant
                          : appStyle.color_on_primary,
                    }}
                  >
                    עברית
                  </CustomText>
                </CustomButton>
                <CustomButton
                  disabled={language == "english"}
                  onPress={() => setLanguage("english")}
                  style={{
                    backgroundColor:
                      language == "english"
                        ? appStyle.color_surface_variant
                        : appStyle.color_on_background,
                  }}
                >
                  <CustomText
                    style={{
                      color:
                        language == "english"
                          ? appStyle.color_on_surface_variant
                          : appStyle.color_on_primary,
                    }}
                  >
                    English
                  </CustomText>
                </CustomButton>
              </View>
            </View>
            <View className="flex-row items-center justify-between mt-5">
              <CustomButton
                className="w-5/12"
                onPress={() => setShowDeleteUserModal(!showDeleteUserModal)}
                style={{
                  backgroundColor: appStyle.color_surface_variant,
                }}
              >
                <CustomText
                  className="py-1 px-1"
                  style={{
                    color: appStyle.color_on_surface_variant,
                  }}
                >
                  {languageService[lastLanguage].deleteUser}
                </CustomText>
              </CustomButton>
              <CustomButton
                onPress={signOut}
                className="w-5/12"
                style={{
                  backgroundColor: appStyle.color_surface_variant,
                }}
              >
                <CustomText
                  className="py-1 px-1"
                  style={{
                    color: appStyle.color_on_surface_variant,
                  }}
                >
                  {languageService[lastLanguage].logOut}
                </CustomText>
              </CustomButton>
            </View>
            <View style={{ flex: 1 }}></View>
            <View
              style={{
                borderRadius: 8,
                backgroundColor: appStyle.color_surface_variant,
              }}
            >
              <CustomButton
                onPress={() => setShowSuggestionForm(true)}
                className="items-center rounded-xl p-3"
              >
                <View
                  style={{
                    backgroundColor: appStyle.color_on_background,
                    borderRadius: 16,
                    padding: 7,
                  }}
                >
                  <FontAwesomeIcon
                    color={appStyle.color_on_primary}
                    icon={faBug}
                    size={30}
                  />
                </View>
              </CustomButton>
              <CustomText
                className="text-lg text-center font-semibold"
                style={{
                  color: appStyle.color_on_surface_variant,
                }}
              >
                {languageService[lastLanguage].reportABug}
              </CustomText>
            </View>
          </View>
          <View
            style={{
              backgroundColor: appStyle.color_surface_variant,
              borderTopWidth: 0.5,
              borderTopColor: appStyle.color_outline,
            }}
            className="h-16 p-2 justify-center items-center"
          >
            <CustomButton
              disabled={!changesMade}
              onPress={applyChanges}
              className="p-1 rounded"
              style={
                changesMade && {
                  backgroundColor: appStyle.color_primary,
                }
              }
            >
              <Text
                className="text-xl text-center"
                style={{
                  color: changesMade
                    ? appStyle.color_on_primary
                    : appStyle.color_on_background,
                }}
              >
                {changesMade == false
                  ? languageService[lastLanguage].noChangesWereMade
                  : languageService[lastLanguage].applyChanges}
              </Text>
            </CustomButton>
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
          language={lastLanguage}
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
