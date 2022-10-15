import { View, Text, Image } from "react-native";
import React from "react";

const UserUpperBanner = () => {
  return (
    <View className="flex-row pb-3 items-center mx-4 space-x-2">
      <Image
        source={{
          uri: "https://i.pinimg.com/564x/39/44/28/394428dcf049dbc614b3a34cef24c164.jpg",
        }}
        className="h-10 w-10 bg-white rounded-full"
      />
      <View>
        <Text className="font-bold text-gray-400 text-xs">
          Chad Chadidovich
        </Text>
        <Text className="font-bold text-lg">Find a workout buddy</Text>
      </View>
    </View>
  );
};

export default UserUpperBanner;
