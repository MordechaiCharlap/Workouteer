import { View, Text, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { React, useLayoutEffect } from "react";
import responsiveStyle from "../components/ResponsiveStyling";
import BottomNavbar from "../components/BottomNavbar";

const CalendarScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  return (
    <SafeAreaView style={responsiveStyle.safeAreaStyle}>
      <View className="flex-1 justify-center">
        <Text className="text-4xl text-white font-bold text-center">
          Coming soon!
        </Text>
      </View>
      <BottomNavbar currentScreen="Calendar" />
    </SafeAreaView>
  );
};

export default CalendarScreen;
