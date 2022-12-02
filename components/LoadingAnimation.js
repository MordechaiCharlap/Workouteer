import Lottie from "lottie-react-native";
import * as appStyle from "./AppStyleSheet";
import { View, Text } from "react-native";
import React from "react";

const LoadingAnimation = () => {
  return (
    <View className="flex-1">
      {Platform.OS == "android" && (
        <Lottie
          source={require("../animations/initialLoading.json")}
          autoPlay
          loop
        />
      )}
      <View className="h-1/3"></View>
      <Text
        style={{ color: appStyle.appLightBlue }}
        className="text-5xl font-semibold tracking-widest text-white text-center"
      >
        Loading
      </Text>
    </View>
  );
};

export default LoadingAnimation;
