import Lottie from "lottie-react-native";
import * as appStyle from "./AppStyleSheet";
import { View, Text, Platform } from "react-native";
import React from "react";
import responsiveStyle from "../components/ResponsiveStyling";

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
        style={{ color: appStyle.color_primary }}
        className="text-5xl font-semibold tracking-widest text-center"
      >
        Loading
      </Text>
    </View>
  );
};

export default LoadingAnimation;
