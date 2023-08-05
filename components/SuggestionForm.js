import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import languageService from "../services/languageService";
import { TouchableOpacity } from "react-native";
import { useEffect } from "react";
import * as appStyle from "../utils/appStyleSheet";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import CustomTextInput from "./basic/CustomTextInput";
import CustomText from "./basic/CustomText";
import CustomButton from "./basic/CustomButton";
import useFirebase from "../hooks/useFirebase";
const SuggestionForm = (props) => {
  const { db } = useFirebase();
  const id = props.id;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isTitleValid, setIsTitleValid] = useState(false);
  const [isContentValid, setIsContentValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState();
  const submitSuggestion = async () => {
    setIsSubmitting(true);
    await addDoc(collection(db, "suggestions"), {
      senderId: id,
      title: title,
      content: content,
      dateSubmitted: Timestamp.now(),
    });
    setIsSubmitting(false);
    setTimeout(() => {
      props.setShowSuggestionForm(false);
    }, 1000);
  };
  useEffect(() => {
    const titleRegex = /^.{5,}$/;
    if (title.match(titleRegex)) setIsTitleValid(true);
    else setIsTitleValid(false);
  }, [title]);
  useEffect(() => {
    const contentRegex = /^[\s\S]{15,}$/;
    if (content.match(contentRegex)) setIsContentValid(true);
    else setIsContentValid(false);
  }, [content]);
  return (
    <View
      className="flex-1 justify-center p-5"
      style={{ backgroundColor: `rgba(0, 0, 0, 0.6)` }}
    >
      <View
        className="px-3 py-2"
        style={{
          borderRadius: 8,
          borderColor: appStyle.color_outline,
          borderWidth: 1,
          backgroundColor: appStyle.color_surface,
        }}
      >
        <CustomText style={style.title}>
          {languageService[props.language].helpUsMakeAppBetter}
        </CustomText>
        <View class="titleStuff">
          <View
            className={`items-center flex-row${
              props.language == "hebrew" ? "-reverse" : ""
            }`}
          >
            <CustomText style={style.text}>
              {languageService[props.language].title + ":"}
            </CustomText>
            <View style={{ width: 10 }} />
            <CustomTextInput
              style={{
                backgroundColor: appStyle.color_surface_variant,
              }}
              maxLength={20}
              onChangeText={(text) => setTitle(text)}
              spellCheck={false}
              autoCorrect={false}
            />
          </View>
          <CustomText style={style.textInstruction}>
            {isTitleValid
              ? ""
              : languageService[props.language].titleInstruction}
          </CustomText>
        </View>
        <View style={{ height: 10 }} />
        <View>
          <View>
            <CustomText>
              {languageService[props.language].details + ":"}
            </CustomText>

            <TextInput
              style={{
                maxHeight: 300,
                backgroundColor: appStyle.color_surface_variant,
                padding: 7,
                textAlignVertical: "top",
              }}
              spellCheck={false}
              autoCorrect={false}
              multiline
              numberOfLines={13}
              maxLength={200}
              onChangeText={(text) => setContent(text)}
            />
          </View>
          <CustomText style={style.textInstruction}>
            {isContentValid
              ? ""
              : languageService[props.language].contentInstruction}
          </CustomText>
        </View>
        <View className="flex-row justify-center" style={{ columnGap: 5 }}>
          {isSubmitting == null && (
            <CustomButton
              round
              style={{
                borderColor: appStyle.color_error,
                borderWidth: 0.25,
                paddingVertical: 4,
              }}
              className="self-center"
              onPress={() => props.setShowSuggestionForm(false)}
            >
              <CustomText
                className="text-xl"
                style={{
                  color: appStyle.color_on_surface_variant,
                }}
              >
                {languageService[props.language].cancel}
              </CustomText>
            </CustomButton>
          )}
          <CustomButton
            round
            style={
              isContentValid && isTitleValid
                ? style.submitButton
                : style.submitButtonDisabled
            }
            className="flex-1"
            disabled={!isContentValid || !isTitleValid || isSubmitting != null}
            onPress={submitSuggestion}
          >
            <CustomText
              className="tracking-widest font-semibold text-xl"
              style={{
                color:
                  !isContentValid || !isTitleValid
                    ? appStyle.color_on_surface_variant
                    : appStyle.color_background,
              }}
            >
              {isSubmitting == null
                ? languageService[props.language].submit
                : isSubmitting == true
                ? languageService[props.language].submitting
                : languageService[props.language].submittedSuccesfully}
            </CustomText>
          </CustomButton>
        </View>
      </View>
    </View>
  );
};
const style = StyleSheet.create({
  text: { color: appStyle.color_on_background },
  textInstruction: {
    color: "red",
  },
  submitButton: {
    backgroundColor: appStyle.color_on_background,
    paddingVertical: 4,
  },
  submitButtonDisabled: {
    backgroundColor: appStyle.color_surface_variant,
    paddingVertical: 4,
  },
  titleInput: {
    backgroundColor: appStyle.color_on_primary,
    flexGrow: 1,
    borderRadius: 5,
    paddingHorizontal: 3,
  },
  contentInput: {
    paddingHorizontal: 3,
    paddingTop: 5,
    backgroundColor: appStyle.color_on_primary,
    flexGrow: 1,
    borderRadius: 5,
    textAlignVertical: "top",
  },
  title: {
    textAlign: "center",
    borderRadius: 5,
    padding: 10,
    fontSize: 24,
    color: appStyle.color_on_background,
  },
});
export default SuggestionForm;
