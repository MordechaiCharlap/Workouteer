import {
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";
import authContext from "../context/authContext";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronLeft,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../components/AppStyleSheet";
const ChatScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useContext(authContext);
  const otherUser = route.params.otherUser;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1">
        <View
          className="flex-row items-center pb-3 pt-2"
          style={{ backgroundColor: "#333946" }}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={40}
            color={appStyle.appGray}
          />
          <Image
            source={{
              uri: otherUser.img,
            }}
            className="h-14 w-14 bg-white rounded-full mr-4"
          />
          <Text className="text-2xl" style={{ color: appStyle.appGray }}>
            {otherUser.username}
          </Text>
        </View>
      </View>
      <View className="flex-row p-2 items-center">
        <TextInput
          className="text-2xl flex-1 mr-2 rounded-full py-1 pl-4"
          placeholder="Message"
          placeholderTextColor={appStyle.appGray}
          style={{ backgroundColor: "#333946" }}
        ></TextInput>
        <FontAwesomeIcon
          icon={faCommentDots}
          size={35}
          color={appStyle.appGray}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
