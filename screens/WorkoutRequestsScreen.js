import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React, {
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import responsiveStyle from "../components/ResponsiveStyling";
import useAuth from "../hooks/useAuth";
import usePushNotifications from "../hooks/usePushNotifications";
const WorkoutRequestsScreen = ({ route }) => {
  const navigation = useNavigation();

  const { user } = useAuth();
  const { sendPushNotificationsForWorkoutMembers, sendPushNotification } =
    usePushNotifications();

  const workout = route.params.workout;
  const [requesters, setRequesters] = useState();
  const [buttonLoading, setButtonLoading] = useState(false);
  useFocusEffect(
    useCallback(() => {
      const getWorkoutRequesters = async () => {
        const requestersArray = await firebase.getWorkoutRequesters(workout);
        setRequesters(requestersArray);
      };
      getWorkoutRequesters();
    }, [])
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const acceptUser = async (acceptedUser, index) => {
    setButtonLoading("accept");
    await sendPushNotificationsForWorkoutMembers(
      workout,
      "New Alert!",
      `${acceptedUser.displayName} joined your workout`,
      user.id
    );
    await firebase.acceptWorkoutRequest(acceptedUser, workout);
    const requestersClone = requesters.slice();
    requestersClone[index].accepted = true;
    setRequesters(requestersClone);
    await sendPushNotification(
      workout,
      "New Alert!",
      `${user.displayName} accepted your request to join the workout`,
      user.id
    );
    setButtonLoading(false);
  };
  const rejectUser = async (rejectedUser, index) => {
    setButtonLoading("reject");
    await firebase.rejectWorkoutRequest(rejectedUser.id, workout);
    const requestersClone = requesters.slice();
    requestersClone[index].accepted = false;
    setRequesters(requestersClone);
    setButtonLoading(false);
  };
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Header title={"Requests"} goBackOption={true} />
      <View
        style={{ backgroundColor: appStyle.color_bg }}
        className="rounded flex-1 mx-4"
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
                    className="text-xl font-semibold tracking-wider"
                    style={{ color: appStyle.color_primary }}
                  >
                    {item.user.username}
                  </Text>
                  <Text
                    className="text-md opacity-60 tracking-wider"
                    style={{ color: appStyle.color_primary }}
                  >
                    {item.user.displayName}
                  </Text>
                </View>
              </View>
              {item.accepted == null ? (
                <View className="flex-row justify-between w-40">
                  <TouchableOpacity
                    onPress={() => acceptUser(item.user, index)}
                    className="justify-center py-2 px-4 rounded"
                    style={{ backgroundColor: appStyle.color_primary }}
                  >
                    <Text
                      className="text-center"
                      style={{ color: appStyle.color_on_primary }}
                    >
                      {buttonLoading == "accept" ? "Loading" : "Accept"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => rejectUser(item.user, index)}
                    className="justify-center py-2 px-4 rounded"
                    style={{
                      backgroundColor: appStyle.color_bg_variant,
                      borderColor: appStyle.color_primary,
                      borderWidth: 1,
                    }}
                  >
                    <Text
                      style={{ color: appStyle.color_on_primary }}
                      className="text-center"
                    >
                      {buttonLoading == "reject" ? "Loading" : "Reject"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  className="w-40 mr-2 h-10 rounded justify-center"
                  style={{ backgroundColor: appStyle.color_primary }}
                >
                  <Text
                    className="text-center text-lg"
                    style={{ color: appStyle.color_on_primary }}
                  >
                    {item.accepted == false ? "Rejected" : "Accepted"}
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
