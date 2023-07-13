import Lottie from "lottie-react-native";
import * as appStyle from "../utils/appStyleSheet";
import { View, Text, Platform, Image, ActivityIndicator } from "react-native";
import React from "react";

const LoadingAnimation = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator
          size={Platform.OS == "android" ? 140 : "large"}
          color={appStyle.color_primary}
        />
        <View className="absolute w-full h-full items-center justify-center">
          <Image
            style={{ height: 50, width: 50 }}
            source={require("../assets/app-icon-transparent.png")}
          />
        </View>
      </View>
    </View>
  );
};

export default LoadingAnimation;
