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
import * as appStyle from "../utils/appStyleSheet";
import * as firebase from "../services/firebase";
import { safeAreaStyle } from "../components/safeAreaStyle";
import useAuth from "../hooks/useAuth";
import usePushNotifications from "../hooks/usePushNotifications";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import languageService from "../services/languageService";
import CustomButton from "../components/basic/CustomButton";
import CustomText from "../components/basic/CustomText";

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
    await sendPushNotificationCreatorAcceptedYourRequest(
      acceptedUser,
      workout.id
    );
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
        style={{
          backgroundColor: appStyle.color_background,
          paddingHorizontal: 16,
        }}
        className="flex-1"
      >
        <FlatList
          data={requesters}
          keyExtractor={(item) => item.user.id}
          renderItem={({ item, index }) => (
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Image
                  className="rounded-full"
                  style={style.image}
                  source={{ uri: item.user.img }}
                />
                <View className="ml-2">
                  <Text
                    className="text-xl font-semibold"
                    style={{ color: appStyle.color_on_background }}
                  >
                    {item.user.id}
                  </Text>
                  <Text
                    className="text-md opacity-60"
                    style={{ color: appStyle.color_on_background }}
                  >
                    {item.user.displayName}
                  </Text>
                </View>
              </View>
              {item.accepted == null ? (
                <View className="flex-row">
                  <CustomButton
                    onPress={() => acceptUser(item.user, index)}
                    style={{
                      backgroundColor: appStyle.color_on_background,
                      borderRadius: 8,
                      paddingHorizontal: 16,
                    }}
                  >
                    <CustomText
                      className="text-center"
                      style={{ color: appStyle.color_background }}
                    >
                      {languageService[user.language].accept}
                    </CustomText>
                  </CustomButton>
                  <View style={{ width: 5 }} />
                  <CustomButton
                    onPress={() => rejectUser(item.user, index)}
                    style={{
                      backgroundColor: appStyle.color_surface_variant,
                      borderColor: appStyle.color_primary,
                      borderWidth: 1,
                      borderRadius: 8,
                      paddingHorizontal: 16,
                    }}
                  >
                    <CustomText
                      style={{ color: appStyle.color_on_surface_variant }}
                      className="text-center"
                    >
                      {languageService[user.language].reject}
                    </CustomText>
                  </CustomButton>
                </View>
              ) : (
                <CustomButton
                  disabled
                  className="justify-center"
                  style={{
                    backgroundColor:
                      item.accepted == false
                        ? appStyle.color_error
                        : appStyle.color_success,
                    borderColor: appStyle.color_outline,
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingHorizontal: 24,
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
                </CustomButton>
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
    width: 50,
    height: 50,
    borderWidth: 0.8,
    borderColor: appStyle.color_primary,
  },
  map: {
    width: 300,
    height: 300,
  },
});

export default WorkoutRequestsScreen;
