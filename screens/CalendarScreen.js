import { View, Text, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { React, useLayoutEffect } from "react";
import responsiveStyle from "../components/ResponsiveStyling";
import BottomNavbar from "../components/BottomNavbar";
import * as appStyle from "../components/AppStyleSheet";
const CalendarScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View className="flex-1 justify-center">
        <Text
          style={{ color: appStyle.color_primary }}
          className="text-4xl font-bold text-center"
        >
          Coming soon!
        </Text>
      </View>
      <BottomNavbar currentScreen="Calendar" />
    </View>
  );
};

export default CalendarScreen;
