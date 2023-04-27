import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import { Modal } from "react-native";
import languageService from "../services/languageService";

const SuggestionModal = (props) => {
  const id = props.id;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const isValidTitle = () => {
    const titleRegex = /^.{5,}$/;
    if (title.match(titleRegex)) return true;
    return false;
  };
  const isValidContent = () => {
    const contentRegex = /^.{15,}$/;
    if (content.match(contentRegex)) return true;
    return false;
  };
  return (
    <Modal visible={props.showSuggestionModal}>
      <View
        className={`flex-row${props.language == "hebrew" ? "-reverse" : ""}`}
      >
        <Text>{languageService[props.language].title + ":"}</Text>
        <TextInput onChangeText={(text) => setTitle(text)} />
      </View>
      <Text>
        {isValidTitle() ? "" : languageService[props.language].titleInstruction}
      </Text>
      <View
        className={`flex-row${props.language == "hebrew" ? "-reverse" : ""}`}
      >
        <Text>{languageService[props.language].details + ":"}</Text>
        <TextInput onChangeText={(text) => setContent(text)} />
      </View>
      <Text>
        {isValidContent()
          ? ""
          : languageService[props.language].contentInstruction}
      </Text>
    </Modal>
  );
};

export default SuggestionModal;
