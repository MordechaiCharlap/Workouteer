import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useState } from "react";
import * as appStyle from "../utilities/appStyleSheet";
import * as firebase from "../services/firebase";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import usePushNotifications from "../hooks/usePushNotifications";
import languageService from "../services/languageService";
import CustomTextInput from "../components/basic/CustomTextInput";
import appComponentsDefaultStyles from "../utilities/appComponentsDefaultStyles";
import CustomButton from "../components/basic/CustomButton";

const InviteFriendsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();
  const { sendPushNotificationInviteFriendToWorkout } = usePushNotifications();
  const { user } = useAuth();
  const [workout, setWorkout] = useState(route.params.workout);
  const [searchText, setSearchText] = useState("");
  const [shownFriendsArray, setShownFriendsArray] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("InviteFriends");
      const showFriends = async () => {
        const allFriendsMap = new Map(Object.entries(user.friends));
        const friendsArr = [];
        for (var key of allFriendsMap.keys()) {
          var userData = await firebase.userDataById(key);
          friendsArr.push(userData);
        }
        setShownFriendsArray(friendsArr);
      };
      showFriends();
    }, [])
  );
  const inviteFriend = async (friend) => {
    setButtonLoading(friend.id);
    const workoutClone = { ...workout };
    if (workoutClone.invites == null) {
      workoutClone.invites = { [friend.id]: true };
    } else {
      workoutClone.invites[friend.id] = true;
    }
    await firebase.inviteFriendToWorkout(friend.id, workout);
    await sendPushNotificationInviteFriendToWorkout(friend);
    setWorkout(workoutClone);
    setButtonLoading(false);
  };
  const getButton = (friend) => {
    if (workout.invites && workout.invites[friend.id] != null) {
      return (
        <View
          className="py-1 w-28 rounded"
          style={{
            backgroundColor: appStyle.color_success,
            borderWidth: 0.8,
            borderColor: appStyle.color_on_background,
          }}
        >
          <Text
            className="text-lg text-center font-semibold"
            style={{
              color: appStyle.color_on_background,
            }}
          >
            {languageService[user.language].invited[friend.isMale ? 1 : 0]}
          </Text>
        </View>
      );
    } else if (workout.members[friend.id]) {
      return (
        <View
          className="py-1 w-28 rounded"
          style={{
            backgroundColor: appStyle.color_primary,
          }}
        >
          <Text
            className="text-lg text-center font-semibold"
            style={{ color: appStyle.color_on_primary }}
          >
            {languageService[user.language].joined[friend.isMale ? 1 : 0]}
          </Text>
        </View>
      );
    }
    return (
      <CustomButton
        onPress={async () => inviteFriend(friend)}
        className="w-28"
        style={{
          backgroundColor: appStyle.color_surface_variant,
          borderColor: appStyle.color_on_background,
          borderWidth: 0.5,
        }}
      >
        <Text
          className="text-lg text-center font-semibold"
          style={{ color: appStyle.color_on_background }}
        >
          {buttonLoading == friend.id
            ? languageService[user.language].loading
            : languageService[user.language].invite[user.isMale ? 1 : 0]}
        </Text>
      </CustomButton>
    );
  };
  return (
    <View style={safeAreaStyle()}>
      <Header
        title={
          languageService[user.language].inviteFriends[user.isMale ? 1 : 0]
        }
        goBackOption={true}
      />
      <View
        className="rounded-xl p-3 mx-2"
        style={{ backgroundColor: appStyle.color_background_variant }}
      >
        <View className="flex-row items-center">
          <CustomButton>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size={20}
              color={appStyle.color_on_background}
            />
          </CustomButton>
          <CustomTextInput
            onChangeText={(text) => setSearchText(text)}
            style={appComponentsDefaultStyles.input}
            placeholder={languageService[user.language].search}
            placeholderTextColor={appStyle.color_on_background}
            className="text-xl ml-3"
          />
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4 pt-3"
        data={shownFriendsArray}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          !workout.requests[item.id] && (
            <View className="flex-row items-center mt-2">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Profile", {
                    shownUser: item,
                    friendshipStatus: "Friends",
                  })
                }
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
                    style={{ color: appStyle.color_on_background }}
                  >
                    {item.id}
                  </Text>
                  <Text
                    className="text-md opacity-60 tracking-wider"
                    style={{ color: appStyle.color_on_background }}
                  >
                    {item.displayName}
                  </Text>
                </View>
              </TouchableOpacity>
              {getButton(item)}
            </View>
          )
        }
      />
    </View>
  );
};

export default InviteFriendsScreen;
