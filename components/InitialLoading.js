import { Image } from "react-native";
import React from "react";

const InitialLoading = () => {
  return (
    <Image
      source={require("../assets/splash-screen.png")}
      className="w-full h-full"
    />
  );
};

export default InitialLoading;
