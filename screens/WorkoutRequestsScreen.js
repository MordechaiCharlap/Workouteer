import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import responsiveStyle from "../components/ResponsiveStyling";
const WorkoutRequestsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [changesMade, setChangesMade] = useState(false);
  const workout = route.params.workout;
  const requestersArray = route.params.requestersArray;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const acceptUser = async (user) => {
    await firebase.acceptWorkoutRequest(user.usernameLower, workout);
    setChangesMade(true);
  };
  const rejectUser = async (user) => {
    await firebase.rejectWorkoutRequest(user.usernameLower, workout);
    setChangesMade(true);
  };
  const goBack = () => {
    if (changesMade) {
      navigation.navigate("WorkoutDetails", {
        workout: workout,
        isCreator: true,
        isPastWorkout: false,
        userMemberStatus: "creator",
      });
    } else {
      navigation.goBack();
    }
  };
  return (
    <SafeAreaView style={responsiveStyle.safeAreaStyle}>
      <Header title={"Requests"} goBackOption={true} navigate={goBack} />
      <View
        style={{ backgroundColor: appStyle.appLightBlue }}
        className="rounded flex-1 mx-4"
      >
        <FlatList
          data={requestersArray}
          keyExtractor={(item) => item.usernameLower}
          renderItem={({ item }) => (
            <View className="p-1 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Image
                  className="rounded-full"
                  style={style.image}
                  source={{ uri: item.img }}
                />
                <View className="ml-2">
                  <Text
                    className="text-xl font-semibold tracking-wider"
                    style={{ color: appStyle.appDarkBlue }}
                  >
                    {item.username}
                  </Text>
                  <Text
                    className="text-md opacity-60 tracking-wider"
                    style={{ color: appStyle.appDarkBlue }}
                  >
                    {item.displayName}
                  </Text>
                </View>
              </View>
              <View className="flex-row justify-between w-36 mr-3">
                <TouchableOpacity
                  onPress={() => acceptUser(item)}
                  className="py-2 px-3 rounded"
                  style={{
                    borderColor: appStyle.appDarkBlue,
                    borderWidth: 1,
                  }}
                >
                  <Text>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => rejectUser(item)}
                  className="py-2 px-3 rounded"
                  style={{ backgroundColor: appStyle.appDarkBlue }}
                >
                  <Text style={{ color: appStyle.appGray }}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
    borderWidth: 0.8,
    borderColor: appStyle.appDarkBlue,
  },
  map: {
    width: 300,
    height: 300,
  },
});

export default WorkoutRequestsScreen;
