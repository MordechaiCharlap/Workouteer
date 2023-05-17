import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import languageService from "../services/languageService";
import { TouchableOpacity } from "react-native";
import { useEffect } from "react";
import * as appStyle from "../utilities/appStyleSheet";
import { Timestamp, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db as dbImport } from "../services/firebase";
const SuggestionForm = (props) => {
  const db = dbImport;
  const id = props.id;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isTitleValid, setIsTitleValid] = useState(false);
  const [isContentValid, setIsContentValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState();
  const submitSuggestion = async () => {
    setIsSubmitting(true);
    const suggestionsData = (
      await getDoc(doc(db, "suggestions/suggestionsCollectionData"))
    ).data();
    const newNumberOfSuggestions = suggestionsData.numberOfSuggestions + 1;
    await updateDoc(doc(db, "suggestions/suggestionsCollectionData"), {
      numberOfSuggestions: newNumberOfSuggestions,
    });
    await setDoc(doc(db, "suggestions", String(newNumberOfSuggestions)), {
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
    const contentRegex = /^.{15,}$/;
    if (content.match(contentRegex)) setIsContentValid(true);
    else setIsContentValid(false);
  }, [content]);
  return (
    <View
      className="flex-1 justify-center p-5"
      style={{ backgroundColor: `rgba(0, 0, 0, 0.6)` }}
    >
      <View
        className="rounded px-3 py-2 gap-y-3"
        style={{
          backgroundColor: appStyle.color_background,
          borderColor: appStyle.color_primary,
          borderWidth: 1,
        }}
      >
        <View className="items-center">
          <Text style={style.title}>
            {languageService[props.language].helpUsMakeAppBetter}
          </Text>
        </View>
        <View class="titleStuff">
          <View
            className={`gap-x-2 items-center flex-row${
              props.language == "hebrew" ? "-reverse" : ""
            }`}
          >
            <Text style={style.text}>
              {languageService[props.language].title + ":"}
            </Text>
            <TextInput
              style={style.titleInput}
              maxLength={20}
              onChangeText={(text) => setTitle(text)}
              spellCheck={false}
              autoCorrect={false}
            />
          </View>
          <Text style={style.textInstruction}>
            {isTitleValid
              ? ""
              : languageService[props.language].titleInstruction}
          </Text>
        </View>
        <View class="contentStuff">
          <View className="gap-y-2">
            <Text style={style.text}>
              {languageService[props.language].details + ":"}
            </Text>
            <TextInput
              spellCheck={false}
              autoCorrect={false}
              multiline
              numberOfLines={15}
              className=""
              style={style.contentInput}
              maxLength={200}
              onChangeText={(text) => setContent(text)}
            />
          </View>
          <Text style={style.textInstruction}>
            {isContentValid
              ? ""
              : languageService[props.language].contentInstruction}
          </Text>
        </View>

        <TouchableOpacity
          style={
            !isContentValid || !isTitleValid
              ? style.submitButtonDisabled
              : style.submitButton
          }
          className="self-center"
          disabled={!isContentValid || !isTitleValid || isSubmitting != null}
          onPress={submitSuggestion}
        >
          <Text
            className="tracking-widest font-semibold text-xl"
            style={style.submitButtonText}
          >
            {isSubmitting == null
              ? languageService[props.language].submit
              : isSubmitting == true
              ? languageService[props.language].submitting
              : languageService[props.language].submittedSuccesfully}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const style = StyleSheet.create({
  text: { color: appStyle.color_primary },
  textInstruction: {
    color: "red",
  },
  submitButton: {
    backgroundColor: appStyle.color_primary,
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 2,
  },
  submitButtonDisabled: {
    backgroundColor: appStyle.color_background_variant,
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 2,
  },
  submitButtonText: {
    color: appStyle.color_on_primary,
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
    borderRadius: 5,
    padding: 10,
    fontSize: 24,
    color: appStyle.color_primary,
  },
});
export default SuggestionForm;
