import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { React, useLayoutEffect } from "react";
import responsiveStyle from "../components/ResponsiveStyling";

const ChangePreferencesScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <View className="flex-1 justify-center">
        <Text className="text-4xl text-white font-bold text-center">
          Coming soon!
        </Text>
      </View>
    </View>
  );
};

export default ChangePreferencesScreen;
