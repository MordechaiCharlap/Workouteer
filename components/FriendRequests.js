import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React from "react";
import * as appStyle from "./AppStyleSheet";
import * as firebase from "../services/firebase";

const FriendRequests = (props) => {
  console.log(props.friendRequests);
  const acceptRequest = async (otherUserId, index) => {
    console.log(otherUserId);
    await firebase.acceptRequest(props.user.usernameLower, otherUserId);
    await props.deleteRequest(index);
  };
  const rejectRequest = async (otherUserId, index) => {
    console.log(otherUserId);
    await firebase.rejectRequest(props.user.usernameLower, otherUserId);
    await props.deleteRequest(index);
  };
  if (props.friendRequests.length != 0)
    return (
      <View className="flex-1 mt-3">
        <FlatList
          className="px-4 pt-3"
          data={props.friendRequests}
          keyExtractor={(item) => item.usernameLower}
          renderItem={({ item, index }) => (
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
                  onPress={() => acceptRequest(item.usernameLower, index)}
                  className="p-1 rounded"
                  style={{ backgroundColor: appStyle.appAzure }}
                >
                  <Text
                    className="text-2xl"
                    style={{ color: appStyle.appGray }}
                  >
                    Accept
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => rejectRequest(item.usernameLower, index)}
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
  else {
    return (
      <View>
        <Text className="text-2xl text-center p-3" style={{ color: "white" }}>
          No requests!
        </Text>
      </View>
    );
  }
};

export default FriendRequests;
