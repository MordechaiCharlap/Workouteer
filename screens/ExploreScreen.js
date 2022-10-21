import { SafeAreaView, Text, View } from "react-native";
import { React, useLayoutEffect } from "react";
import ResponsiveStyling from "../components/ResponsiveStyling";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
const ExploreScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1 justify-center">
        <Text className="text-4xl text-white font-bold text-center">
          Coming soon!
        </Text>
      </View>
      <BottomNavbar currentScreen="Explore" />
    </SafeAreaView>
  );
};

export default ExploreScreen;
