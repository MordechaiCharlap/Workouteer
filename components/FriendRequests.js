import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React from "react";
import * as appStyle from "./AppStyleSheet";
import * as firebase from "../services/firebase";

const FriendRequests = (props) => {
  const acceptRequest = async (otherUserId) => {
    await firebase.acceptRequest(props.user.usernameLower, otherUserId);
  };
  const rejectRequest = async (otherUserId) => {
    await firebase.rejectRequest(props.user.usernameLower, otherUserId);
  };
  //Make sure delete line AUTO!
  return (
    <View className="flex-1 mt-3">
      <FlatList
        data={props.friendRequests}
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
                onPress={() => acceptRequest(item.id)}
                className="p-1 rounded"
                style={{ backgroundColor: appStyle.appAzure }}
              >
                <Text className="text-2xl" style={{ color: appStyle.appGray }}>
                  Accept
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => rejectRequest(item.id)}
                className="ml-2 p-1 rounded"
                style={{ backgroundColor: appStyle.appGray }}
              >
                <Text className="text-2xl" style={{ color: "black" }}>
                  Reject
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
