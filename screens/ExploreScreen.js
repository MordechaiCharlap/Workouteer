import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { React, useLayoutEffect, useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import authContext from "../context/authContext";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import ResponsiveStyling from "../components/ResponsiveStyling";
const ExploreScreen = () => {
  const { user } = useContext(authContext);
  const [friendRequests, setFriendRequests] = useState(null);
  const navigation = useNavigation();
  const [renderOption, setRenderOption] = useState("Explore");
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  useEffect(() => {
    const fetchRequests = async () => {
      const friendReqs = await firebase.getOthersRequests(user);
      var friendsReqsArr = [];
      friendReqs.forEach((value, key) => {
        const date = new Date(Number(value.timestamp)).toLocaleDateString();
        friendsReqsArr.push({
          id: key,
          displayName: value.displayName,
          img: value.img,
          date: date,
        });
      });
      setFriendRequests(friendsReqsArr);
    };
    fetchRequests();
  }, []);

  const renderExplorePage = () => {
    if (renderOption == "Friend requests") {
      console.log("rendering friends requests");
      console.log(friendRequests);
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
                    <Text
                      className="text-2xl"
                      style={{ color: appStyle.appGray }}
                    >
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
    }
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1 p-3">
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={() => setRenderOption("Friend requests")}>
            <Text
              className="text-2xl w-min bg-gray-500"
              style={style.socialButton}
            >
              Friend requests: {user.friendRequestCount}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text
              className="text-2xl w-min bg-gray-500"
              style={style.socialButton}
            >
              Notifications: {user.notifications?.length || 0}
            </Text>
          </TouchableOpacity>
        </View>
        {renderExplorePage()}
      </View>
      <BottomNavbar currentScreen="Explore" />
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  socialButton: {
    borderColor: appStyle.appGray,
    borderWidth: 1,
    color: appStyle.appGray,
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
});
export default ExploreScreen;
