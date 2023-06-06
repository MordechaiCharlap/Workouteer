import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header";
import * as appStyle from "../utilities/appStyleSheet";
import * as firebase from "../services/firebase";
import { safeAreaStyle } from "../components/safeAreaStyle";
import useAuth from "../hooks/useAuth";
import usePushNotifications from "../hooks/usePushNotifications";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import languageService from "../services/languageService";

const WorkoutRequestsScreen = ({ route }) => {
  const { setCurrentScreen } = useNavbarDisplay();

  const { user } = useAuth();
  const {
    sendPushNotificationUserJoinedYouwWorkout,
    sendPushNotificationCreatorAcceptedYourRequest,
  } = usePushNotifications();

  const workout = route.params.workout;
  const [requesters, setRequesters] = useState();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("WorkoutRequests");
      const getWorkoutRequesters = async () => {
        const requestersArray = await firebase.getWorkoutRequesters(workout);
        setRequesters(requestersArray);
      };
      getWorkoutRequesters();
    }, [])
  );
  const acceptUser = async (acceptedUser, index) => {
    const requestersClone = requesters.slice();
    requestersClone[index].accepted = true;
    setRequesters(requestersClone);
    await sendPushNotificationUserJoinedYouwWorkout(
      workout,
      "Workouteer",
      acceptedUser,
      user.id
    );
    await firebase.acceptWorkoutRequest(acceptedUser, workout);
    await sendPushNotificationCreatorAcceptedYourRequest(acceptedUser);
  };
  const rejectUser = async (rejectedUser, index) => {
    const requestersClone = requesters.slice();
    requestersClone[index].accepted = false;
    setRequesters(requestersClone);
    await firebase.rejectWorkoutRequest(rejectedUser.id, workout);
  };
  return (
    <View style={safeAreaStyle()}>
      <Header title={"Requests"} goBackOption={true} />
      <View
        style={{ backgroundColor: appStyle.color_background }}
        className="rounded flex-1"
      >
        <FlatList
          data={requesters}
          keyExtractor={(item) => item.user.id}
          renderItem={({ item, index }) => (
            <View className="p-1 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Image
                  className="rounded-full"
                  style={style.image}
                  source={{ uri: item.user.img }}
                />
                <View className="ml-2">
                  <Text
                    className="text-xl font-semibold"
                    style={{ color: appStyle.color_primary }}
                  >
                    {item.user.id}
                  </Text>
                  <Text
                    className="text-md opacity-60"
                    style={{ color: appStyle.color_primary }}
                  >
                    {item.user.displayName}
                  </Text>
                </View>
              </View>
              {item.accepted == null ? (
                <View className="flex-row">
                  <TouchableOpacity
                    onPress={() => acceptUser(item.user, index)}
                    className="justify-center py-2 px-4 rounded"
                    style={{ backgroundColor: appStyle.color_primary }}
                  >
                    <Text
                      className="text-center"
                      style={{ color: appStyle.color_on_primary }}
                    >
                      {languageService[user.language].accept}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => rejectUser(item.user, index)}
                    className="justify-center py-2 px-4 rounded ml-2"
                    style={{
                      backgroundColor: appStyle.color_background_variant,
                      borderColor: appStyle.color_primary,
                      borderWidth: 1,
                    }}
                  >
                    <Text
                      style={{ color: appStyle.color_on_primary }}
                      className="text-center"
                    >
                      {languageService[user.language].reject}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  className="rounded justify-center py-2 px-4"
                  style={{
                    backgroundColor: "#228B22",
                    borderColor: "#87CEEB",
                    borderWidth: 1,
                  }}
                >
                  <Text
                    className="text-center"
                    style={{ color: appStyle.color_on_primary }}
                  >
                    {item.accepted == false
                      ? languageService[user.language].rejected[
                          item.user.isMale ? 1 : 0
                        ]
                      : languageService[user.language].accepted[
                          item.user.isMale ? 1 : 0
                        ]}
                  </Text>
                </View>
              )}
            </View>
          )}
        />
      </View>
    </View>
  );
};
const style = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
    borderWidth: 0.8,
    borderColor: appStyle.color_primary,
  },
  map: {
    width: 300,
    height: 300,
  },
});

export default WorkoutRequestsScreen;
