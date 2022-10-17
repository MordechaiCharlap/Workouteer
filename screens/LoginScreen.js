import { SafeAreaView, Text } from "react-native";
import React from "react";
import BottomNavbar from "../components/BottomNavbar";
import ResponsiveStyling from "../components/ResponsiveStyling";
const LoginScreen = () => {
  return (
    <SafeAreaView>
      <Text>LoginScreen</Text>
      <BottomNavbar />
    </SafeAreaView>
  );
};

export default LoginScreen;
