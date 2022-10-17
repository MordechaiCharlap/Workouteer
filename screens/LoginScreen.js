import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { React, useLayoutEffect } from "react";
import BottomNavbar from "../components/BottomNavbar";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { ResponsiveShadow } from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
const LoginScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1 my-32 mx-6">
        <View
          className={`mb-5 h-4/5 rounded-t-xl ${ResponsiveShadow}`}
          style={{ backgroundColor: appStyle.appDarkBlue, shadowColor: "#000" }}
        ></View>
        <TouchableOpacity
          className={`h-1/5 rounded-b-xl justify-center ${ResponsiveShadow}`}
          style={{ backgroundColor: appStyle.appDarkBlue, shadowColor: "#000" }}
        >
          <Text
            style={{ color: appStyle.appGray }}
            className="text-center tracking-widest font-bold text-xl"
          >
            REGISTER
          </Text>
        </TouchableOpacity>
      </View>

      <BottomNavbar currentScreen="Login" />
    </SafeAreaView>
  );
};

export default LoginScreen;
