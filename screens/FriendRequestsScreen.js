import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
import BottomNavbar from "../components/BottomNavbar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import responsiveStyle from "../components/ResponsiveStyling";
import Header from "../components/Header";
import AlertDot from "../components/AlertDot";
const FriendRequestsScreen = () => {
  const navigation = useNavigation();
  const [friendRequests, setFriendRequests] = useState();
  const { user, setUser } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  useFocusEffect(
    useCallback(() => {
      const setArray = async () => {
        const requestsArray = await firebase.getFriendRequests(user.id);
        setFriendRequests(requestsArray);
      };
      setArray();
    }, [])
  );
  const acceptRequest = async (otherUserId, index) => {
    removeRequestFromArray(index);
    await firebase.acceptRequest(user.id, otherUserId);
    setUser(await firebase.updateContext(user.id));
  };
  const rejectRequest = async (otherUserId, index) => {
    removeRequestFromArray(index);
    await firebase.rejectRequest(user.id, otherUserId);
    setUser(await firebase.updateContext(user.id));
  };
  const removeRequestFromArray = (index) => {
    const requestsClone = [...friendRequests];
    requestsClone.splice(index, 1);
    setFriendRequests(requestsClone);
  };
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Header title={"Friend Requests"} goBackOption={true} />
      <View className="flex-1">
        {user.friendRequestsCount > 0 ? (
          <FlatList
            data={friendRequests}
            keyExtractor={(item) => item.user.id}
            renderItem={({ item, index }) => (
              <View className="flex-row items-center mt-2">
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("User", {
                      user: item.user,
                      isMyUser: false,
                    })
                  }
                  className="flex-row flex-1 items-center"
                >
                  <Image
                    source={{
                      uri: item.user.img,
                    }}
                    className="h-14 w-14 bg-white rounded-full mr-4"
                  />
                  <View>
                    <Text
                      className="text-xl font-semibold tracking-wider"
                      style={{ color: appStyle.appGray }}
                    >
                      {item.user.username}
                    </Text>
                    <Text
                      className="text-md opacity-60 tracking-wider"
                      style={{ color: appStyle.appGray }}
                    >
                      {item.user.displayName}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View className="flex-row">
                  <TouchableOpacity
                    onPress={async () => acceptRequest(item.user.id, index)}
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
                    onPress={async () => rejectRequest(item.user.id, index)}
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
        ) : (
          <View className="items-center flex-1 justify-center">
            <Text
              style={{
                padding: 10,
                backgroundColor: appStyle.color_primary,
                color: appStyle.color_on_primary,
              }}
              className="text-center text-xl"
            >
              No friend requests left
            </Text>
          </View>
        )}
      </View>

      <BottomNavbar />
    </View>
  );
};

export default FriendRequestsScreen;
