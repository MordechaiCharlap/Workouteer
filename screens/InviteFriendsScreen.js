import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
} from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import responsiveStyle from "../components/ResponsiveStyling";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
const InviteFriendsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const [workout, setWorkout] = useState(route.params.workout);
  const [searchText, setSearchText] = useState("");
  const [shownFriendsArray, setShownFriendsArray] = useState([]);
  const [changesMade, setChangesMade] = useState(false);
  useFocusEffect(
    useCallback(() => {
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
  const goBack = () => {
    if (changesMade) {
      navigation.navigate("WorkoutDetails", {
        workout: workout,
        isCreator: true,
        isPastWorkout: false,
        userMemberStatus: "creator",
        changesMade: true,
      });
    } else {
      navigation.goBack();
    }
  };
  const inviteFriend = async (friendId) => {
    setChangesMade(true);
    const workoutClone = { ...workout };
    if (workoutClone.invites == null) {
      workoutClone.invites = { [friendId]: true };
    } else {
      workoutClone.invites[friendId] = true;
    }
    setWorkout(workoutClone);
    await firebase.inviteFriendToWorkout(friendId, workout);
  };
  const getButton = (friendId) => {
    if (workout.invites && workout.invites[friendId] != null) {
      return (
        <View
          className="py-1 px-6 rounded"
          style={{
            backgroundColor: appStyle.color_primary,
          }}
        >
          <Text
            className="text-lg font-semibold"
            style={{ color: appStyle.color_on_primary }}
          >
            Invited
          </Text>
        </View>
      );
    } else if (workout.members[friendId]) {
      return (
        <View
          className="py-1 px-6 rounded"
          style={{
            backgroundColor: appStyle.color_primary,
          }}
        >
          <Text
            className="text-lg font-semibold"
            style={{ color: appStyle.color_on_primary }}
          >
            Joined
          </Text>
        </View>
      );
    }
    return (
      <TouchableOpacity
        onPress={async () => inviteFriend(friendId)}
        className="py-1 px-6 rounded"
        style={{
          backgroundColor: appStyle.color_bg,
          borderColor: appStyle.color_primary,
          borderWidth: 0.5,
        }}
      >
        <Text
          className="text-lg font-semibold"
          style={{ color: appStyle.color_primary }}
        >
          Invite
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Header title={"Invite Friends"} goBackOption={true} navigate={goBack} />
      <View
        className="rounded-xl p-3 mx-2"
        style={{ backgroundColor: appStyle.color_bg_variant }}
      >
        <View className="flex-row items-center">
          <TouchableOpacity>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size={20}
              color={appStyle.color_primary}
            />
          </TouchableOpacity>
          <TextInput
            onChangeText={(text) => setSearchText(text)}
            style={{ color: appStyle.appGray }}
            placeholder="Search"
            placeholderTextColor={appStyle.color_primary}
            className="text-xl ml-3"
          />
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4 pt-3"
        data={shownFriendsArray}
        keyExtractor={(item) => item.usernameLower}
        renderItem={({ item }) => (
          <View className="flex-row items-center mt-2">
            <TouchableOpacity
              onPress={() => navigation.navigate("User", { shownUser: item })}
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
                  style={{ color: appStyle.color_primary }}
                >
                  {item.username}
                </Text>
                <Text
                  className="text-md opacity-60 tracking-wider"
                  style={{ color: appStyle.color_primary }}
                >
                  {item.displayName}
                </Text>
              </View>
            </TouchableOpacity>
            {getButton(item.usernameLower)}
          </View>
        )}
      />
    </View>
  );
};

export default InviteFriendsScreen;
