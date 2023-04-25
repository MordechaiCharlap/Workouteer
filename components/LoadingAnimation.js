import Lottie from "lottie-react-native";
import * as appStyle from "../utilities/appStyleSheet";
import { View, Text, Platform } from "react-native";
import React from "react";
import { safeAreaStyle } from "../components/safeAreaStyle";
import languageService from "../services/languageService";
import useAuth from "../hooks/useAuth";

const LoadingAnimation = () => {
  const { user } = useAuth();
  return (
    <View style={safeAreaStyle()}>
      {Platform.OS == "android" && (
        <Lottie
          source={require("../animations/initialLoading.json")}
          autoPlay
          loop
        />
      )}
      <View className="h-1/3"></View>
      <Text
        style={{ color: appStyle.color_primary }}
        className="text-5xl font-semibold tracking-widest text-center"
      >
        Workouteer
      </Text>
    </View>
  );
};

export default LoadingAnimation;
