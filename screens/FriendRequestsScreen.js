import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
} from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import * as appStyle from "../utilities/appStyleSheet";
import * as firebase from "../services/firebase";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import usePushNotifications from "../hooks/usePushNotifications";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import languageService from "../services/languageService";

const FriendRequestsScreen = () => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();
  const [friendRequests, setFriendRequests] = useState();
  const { user } = useAuth();
  const [friendsAdded, setFriendsAdded] = useState(false);
  const { sendPushNotificationUserAcceptedYourFriendRequest } =
    usePushNotifications();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("FriendRequests");
      const setArray = async () => {
        const requestsArray = await firebase.getFriendRequests(user.id);
        setFriendRequests(requestsArray);
      };
      setArray();
    }, [])
  );
  const acceptFriendRequest = async (otherUser, index) => {
    setFriendsAdded(true);
    removeRequestFromArray(index);
    await sendPushNotificationUserAcceptedYourFriendRequest(otherUser);
    await firebase.acceptFriendRequest(user.id, otherUser.id);
  };
  const rejectFriendRequest = async (otherUser, index) => {
    removeRequestFromArray(index);
    await firebase.rejectFriendRequest(user.id, otherUser.id);
  };
  const removeRequestFromArray = (index) => {
    const requestsClone = [...friendRequests];
    requestsClone.splice(index, 1);
    setFriendRequests(requestsClone);
  };
  return (
    <View style={safeAreaStyle()}>
      <Header title={"Friend Requests"} goBackOption={true} />
      <View className="flex-1 px-2">
        {user.friendRequestsCount > 0 ? (
          <FlatList
            data={friendRequests}
            keyExtractor={(item) => item.user.id}
            renderItem={({ item, index }) => (
              <View className="flex-row items-center mt-2">
                <TouchableOpacity
                  onPress={async () =>
                    navigation.navigate("Profile", {
                      shownUser: item.user,
                      friendshipStatus: await firebase.checkFriendShipStatus(
                        user,
                        item.user.id
                      ),
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
                      style={{ color: appStyle.color_primary }}
                    >
                      {item.user.id}
                    </Text>
                    <Text
                      className="text-md opacity-60 tracking-wider"
                      style={{ color: appStyle.color_primary }}
                    >
                      {item.user.displayName}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View className="flex-row">
                  <TouchableOpacity
                    onPress={async () => acceptFriendRequest(item.user, index)}
                    className="py-1 px-2 rounded"
                    style={{ backgroundColor: appStyle.color_primary }}
                  >
                    <Text
                      className="text-xl"
                      style={{ color: appStyle.color_on_primary }}
                    >
                      {languageService[user.language].accept}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => rejectFriendRequest(item.user, index)}
                    className="ml-2 py-1 px-2 rounded"
                    style={{
                      borderWidth: 1,
                      borderColor: appStyle.color_primary,
                    }}
                  >
                    <Text
                      className="text-xl"
                      style={{ color: appStyle.color_primary }}
                    >
                      {languageService[user.language].reject}
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
              {languageService[user.language].noFriendRequestsLeft}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default FriendRequestsScreen;
