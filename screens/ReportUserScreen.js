import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { StatusBar } from "react-native";
import * as appStyle from "../utilities/appStyleSheet";
import Header from "../components/Header";
import languageService from "../services/languageService";
import { db } from "../services/firebase";
import { Dropdown } from "react-native-element-dropdown";
import { TextInput } from "react-native";
import { useRef } from "react";
import AwesomeModal from "../components/AwesomeModal";
const ReportUserScreen = ({ route }) => {
  const db = db;
  const navigation = useNavigation();
  const { reported } = route.params;
  const { user } = useAuth();
  const isPageReady = true;
  const [isViolationsFocused, setIsViolationsFocused] = useState(false);
  const [violationType, setViolationType] = useState();
  const content = useRef("");
  const [submitting, setSubmitting] = useState(false);
  const [isTypeEmptyError, setIsTypeEmptyError] = useState(false);
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setViolationType();
    }, [])
  );
  const violationsTypes = [
    {
      label: languageService[user.language].profileImageContainsNudity,
      value: "profileImageContainsNudity",
    },
    {
      label: languageService[user.language].harassment,
      value: "harassment",
    },
    {
      label: languageService[user.language].other,
      value: "other",
    },
  ];
  const reportUser = async () => {
    setSubmitting(true);
    setShowSubmittedModal(true);
    setSubmitting(false);
  };
  return (
    <View style={safeAreaStyle()}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Header title={languageService[user.language].report} />
      <View className="flex-1 p-3 gap-y-2">
        <View>
          <Dropdown
            style={[
              style.dropdown,
              isViolationsFocused
                ? { borderColor: appStyle.color_primary }
                : isTypeEmptyError && { borderColor: appStyle.color_error },
            ]}
            placeholder={languageService[user.language].violationType}
            placeholderStyle={style.placeholderStyle}
            selectedTextStyle={style.selectedTextStyle}
            inputSearchStyle={style.inputSearchStyle}
            iconStyle={style.iconStyle}
            data={violationsTypes}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={violationType}
            onFocus={() => setIsViolationsFocused(true)}
            onBlur={() => setIsViolationsFocused(false)}
            onChange={(item) => {
              setViolationType(item.value);
              if (item != null) setIsTypeEmptyError(false);
              setIsViolationsFocused(false);
            }}
          />
        </View>
        <View className="flex-1">
          <TextInput
            className="flex-1"
            style={{
              textAlignVertical: "top",
              backgroundColor: appStyle.color_primary,
              borderRadius: 8,
              padding: 8,
              color: appStyle.color_on_primary,
              fontSize: 16,
            }}
            autoCorrect={false}
            multiline
            placeholder={languageService[user.language].details}
            placeholderTextColor={appStyle.color_lighter}
            onChangeText={(text) => (content.current = text)}
          ></TextInput>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: violationType
              ? appStyle.color_primary
              : appStyle.color_bg_variant,
          }}
          className="rounded py-2"
          onPress={async () =>
            violationType ? await reportUser() : setIsTypeEmptyError(true)
          }
        >
          <Text
            className="text-center text-lg  font-semibold tracking-widest"
            style={{ color: appStyle.color_bg }}
          >
            {languageService[user.language].submit}
          </Text>
        </TouchableOpacity>
      </View>
      <AwesomeModal
        onDismiss={() => navigation.goBack()}
        showCancelButton={false}
        showModal={showSubmittedModal}
        setShowModal={setShowSubmittedModal}
        title={languageService[user.language].reportSubmittedTitle}
        message={languageService[user.language].reportSubmittedTitle}
      />
    </View>
  );
};

export default ReportUserScreen;
const style = StyleSheet.create({
  dropdown: {
    backgroundColor: appStyle.color_primary,
    height: 50,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
    color: "white",
  },
  label: {
    position: "absolute",
    color: appStyle.color_on_primary,
    backgroundColor: appStyle.color_primary,
    left: 22,
    top: -10,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  placeholderStyle: {
    textAlign: "center",
    color: appStyle.color_lighter,
    fontSize: 16,
  },
  selectedTextStyle: {
    textAlign: "center",
    color: appStyle.color_on_primary,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
