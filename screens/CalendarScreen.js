import { View, Text, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { React, useLayoutEffect } from "react";
import ResponsiveStyling from "../components/ResponsiveStyling";
import BottomNavbar from "../components/BottomNavbar";

const CalendarScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  return (
    <SafeAreaView className="flex-1" style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1 ">
        <Text>CalendarScreen</Text>
      </View>
      <BottomNavbar currentScreen="Calendar" />
    </SafeAreaView>
  );
};

export default CalendarScreen;
