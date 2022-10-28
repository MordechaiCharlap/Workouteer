import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React from "react";
import * as appStyle from "./AppStyleSheet";
import * as firebase from "../services/firebase";

const FriendRequests = (props) => {
  console.log(props.friendRequests);
  const acceptRequest = async (otherUserId, index) => {
    props.deleteRequest(index);
    await firebase.acceptRequest(props.user.usernameLower, otherUserId);
  };
  const rejectRequest = async (otherUserId, index) => {
    props.deleteRequest(index);
    await firebase.rejectRequest(props.user.usernameLower, otherUserId);
  };
  //Make sure delete line AUTO!
  return (
    <View className="flex-1 mt-3">
      <FlatList
        className="px-4 pt-3"
        data={props.friendRequests}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View className="flex-row items-center mt-2">
            <TouchableOpacity
              onPress={() => props.userClicked(item)}
              className="flex-row flex-1 items-center"
            >
              <Image
                source={{
                  uri: item.img,
                }}
                className="h-14 w-14 bg-white rounded-full mr-4"
              />
              <View>
                <Text
                  className="text-xl font-semibold tracking-wider"
                  style={{ color: appStyle.appGray }}
                >
                  {item.username}
                </Text>
                <Text
                  className="text-md opacity-60 tracking-wider"
                  style={{ color: appStyle.appGray }}
                >
                  {item.displayName}
                </Text>
              </View>
            </TouchableOpacity>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => acceptRequest(item.usernameLower, item.index)}
                className="p-1 rounded"
                style={{ backgroundColor: appStyle.appAzure }}
              >
                <Text className="text-2xl" style={{ color: appStyle.appGray }}>
                  Accept
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => rejectRequest(item.usernameLower, item.index)}
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
