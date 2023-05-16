import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { StatusBar } from "react-native";
import * as appStyle from "../utilities/appStyleSheet";
import Header from "../components/Header";
import languageService from "../services/languageService";
import { db, storage } from "../services/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Dropdown } from "react-native-element-dropdown";
import { TextInput } from "react-native";
import { useRef } from "react";
import AwesomeModal from "../components/AwesomeModal";
import { addDoc, collection, doc } from "firebase/firestore";
import * as defaultValues from "../services/defaultValues";
const ReportUserScreen = ({ route }) => {
  const navigation = useNavigation();
  const { reported } = route.params;
  const { user } = useAuth();
  const [isViolationsFocused, setIsViolationsFocused] = useState(false);
  const [violationType, setViolationType] = useState();
  const content = useRef("");
  const [submitting, setSubmitting] = useState(false);
  const [isTypeEmptyError, setIsTypeEmptyError] = useState(false);
  const [isContentEmptyError, setIsContentEmptyError] = useState(false);
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
  const copyProfileImage = async (reportId) => {
    const destinationRef = ref(storage, `reports/${reportId}.jpg`);
    const blob = await fetch(reported.img).then((r) => r.blob());
    const metadata = { contentType: "image/jpeg" };
    await uploadBytes(destinationRef, blob, metadata).then((snapshot) => {});
  };
  const createReport = async () => {
    const newReport = {
      reported: {
        id: reported.id,
        description: reported.description,
      },
      reporter: {
        id: user.id,
        description: user.description,
      },
      violationType: violationType,
      content: content.current,
    };
    const newReportRef = await addDoc(collection(db, `reports`), newReport);
    return newReportRef.id;
  };
  const reportUser = async () => {
    setSubmitting(true);
    const reportId = await createReport();
    if (violationType == "profileImageContainsNudity")
      await copyProfileImage(reportId);
    setShowSubmittedModal(true);

    setSubmitting(false);
  };
  const submitPressed = async () => {
    if (violationType == null) {
      setIsTypeEmptyError(true);
      return;
    }
    if (
      violationType != "profileImageContainsNudity" &&
      content.current == ""
    ) {
      setIsContentEmptyError(true);
      return;
    }
    if (
      violationType == "profileImageContainsNudity" &&
      reported.img == defaultValues.defaultProfilePic
    )
      return;
    await reportUser();
  };
  return (
    <View style={safeAreaStyle()}>
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
            onFocus={() => {
              setIsViolationsFocused(true);
            }}
            onBlur={() => setIsViolationsFocused(false)}
            onChange={(item) => {
              if (
                isContentEmptyError &&
                item.value == "profileImageContainsNudity"
              )
                setIsContentEmptyError(false);
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
              borderColor: isContentEmptyError
                ? appStyle.color_error
                : appStyle.color_primary,
              borderWidth: 1.5,
              textAlignVertical: "top",
              backgroundColor: appStyle.color_primary,
              borderRadius: 4,
              padding: 8,
              color: appStyle.color_on_primary,
              fontSize: 16,
            }}
            autoCorrect={false}
            multiline
            placeholder={languageService[user.language].details}
            placeholderTextColor={appStyle.color_lighter}
            onChangeText={(text) => {
              content.current = text;
              if (text != "" && isContentEmptyError)
                setIsContentEmptyError(false);
            }}
          ></TextInput>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: appStyle.color_primary,
          }}
          className="rounded py-2"
          onPress={submitPressed}
        >
          <Text
            className="text-center text-lg  font-semibold tracking-widest"
            style={{ color: appStyle.color_bg }}
          >
            {submitting
              ? languageService[user.language].submitting
              : languageService[user.language].submit}
          </Text>
        </TouchableOpacity>
      </View>
      {showSubmittedModal && (
        <AwesomeModal
          onDismiss={() => navigation.goBack()}
          onConfirm={() => navigation.goBack()}
          showCancelButton={false}
          showModal={showSubmittedModal}
          setShowModal={setShowSubmittedModal}
          title={languageService[user.language].reportSubmittedTitle}
          message={languageService[user.language].reportSubmittedMessage}
        />
      )}
    </View>
  );
};

export default ReportUserScreen;
const style = StyleSheet.create({
  dropdown: {
    backgroundColor: appStyle.color_primary,
    height: 50,
    borderWidth: 1.5,
    borderRadius:4,
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
