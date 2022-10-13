import { Image, SafeAreaView, View, Text, ScrollView } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/ButtomNavbar";

const UserScreen = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="bg-gray-500">
        <View className="items-center">
          <Image
            source={{
              uri: "https://i.pinimg.com/564x/39/44/28/394428dcf049dbc614b3a34cef24c164.jpg",
            }}
            className="h-60 w-60 bg-white rounded-full mt-8 mb-5"
          />
          <Text className="font-bold text-3xl">Chad Chadovich</Text>
        </View>
      </ScrollView>
      <BottomNavbar currentScreen="User" />
    </SafeAreaView>
  );
};

export default UserScreen;
