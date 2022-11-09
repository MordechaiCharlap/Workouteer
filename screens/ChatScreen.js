import { View, Text } from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
import authContext from "../context/authContext";
import { useNavigation } from "@react-navigation/native";
const ChatScreen = (props) => {
  const navigation = useNavigation();
  const { user } = useContext(authContext);
  const otherUser = props.otherUser;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });
  return (
    <View>
      <Text>ChatScreen</Text>
    </View>
  );
};

export default ChatScreen;
