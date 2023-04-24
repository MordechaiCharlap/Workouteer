import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { safeAreaStyle } from "../components/safeAreaStyle";
const LinkUserWithGoogleScreen = ({ route }) => {
  const { googleUserInfo } = useAuth();
  const userData = route.params.userData;
  return (
    <View style={safeAreaStyle()}>
      <Text>That email is associated with this user: is that you?</Text>
      <View className="rounded-full flex-row">
        <Image
          source={{
            uri: userData.img,
          }}
          className="h-14 w-14 bg-white rounded-full mr-4"
        />
      </View>
    </View>
  );
};

export default LinkUserWithGoogleScreen;
