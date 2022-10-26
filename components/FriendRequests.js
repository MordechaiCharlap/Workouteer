import { View, Text } from "react-native";
import React from "react";

const FriendRequests = () => {
  return (
    <View className="flex-1 mt-3">
      <FlatList
        data={friendRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Image
                source={{
                  uri: item.img,
                }}
                className="h-16 w-16 bg-white rounded-full mr-2"
              />
              <Text className="text-xl" style={{ color: appStyle.appGray }}>
                {item.displayName}
              </Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity
                className="p-1 rounded"
                style={{ backgroundColor: appStyle.appAzure }}
              >
                <Text className="text-2xl" style={{ color: appStyle.appGray }}>
                  Accept
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="ml-2 p-1 rounded"
                style={{ backgroundColor: appStyle.appGray }}
              >
                <Text className="text-2xl" style={{ color: "black" }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default FriendRequests;
