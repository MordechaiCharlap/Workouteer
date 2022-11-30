import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { faStopwatch, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { workoutTypes } from "../components/WorkoutType";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import responsiveStyle from "../components/ResponsiveStyling";
import useAuth from "../hooks/useAuth";
import * as appStyle from "../components/AppStyleSheet";
import { timeString } from "../services/timeFunctions";
import * as firebase from "../services/firebase";
const WorkoutDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const workout = route.params.workout;
  const [membersMap, setMembersMap] = useState(new Map());
  const [membersArray, setMembersArray] = useState(new Map());
  const [initalLoading, setInitialLoading] = useState(true);
  useEffect(() => {
    const getMembersData = async () => {
      const membersIdMap = new Map(Object.entries(workout.members));
      const usersData = await firebase.getUsers(membersIdMap);
      setMembersMap(usersData.map);
      setMembersArray(usersData.array);
      setInitialLoading(false);
    };
    getMembersData();
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={responsiveStyle.safeAreaStyle}>
      <Header title={"Details"} goBackOption={true} />
      {initalLoading ? (
        <></>
      ) : (
        <View className="flex-1 px-4">
          <ScrollView
            style={{ backgroundColor: appStyle.appLightBlue }}
            className="flex-1 rounded"
          >
            <View
              style={{
                borderBottomColor: appStyle.appDarkBlue,
                borderBottomWidth: 2,
              }}
            >
              <Text
                className="text-xl m-1"
                style={{ color: appStyle.appDarkBlue }}
              >
                Date: {timeString(workout.startingTime.toDate())}
              </Text>
            </View>
            <View className="flex-row flex-1">
              <View
                className="aspect-square p-2"
                style={{
                  borderRightColor: appStyle.appDarkBlue,
                  borderRightWidth: 2,
                }}
              >
                <FontAwesomeIcon
                  icon={workoutTypes[workout.type].icon}
                  size={120}
                  color={appStyle.appDarkBlue}
                />
              </View>
              <View className="px-2 justify-evenly">
                <View className="flex-row items-center">
                  <FontAwesomeIcon
                    icon={faStopwatch}
                    size={60}
                    color={appStyle.appDarkBlue}
                  />
                  <Text
                    className="text-md"
                    style={{
                      color: appStyle.appDarkBlue,
                    }}
                  >
                    : {workout.minutes} minutes
                  </Text>
                </View>
              </View>
            </View>
            <View
              className="items-center"
              style={{
                borderTopColor: appStyle.appDarkBlue,
                borderTopWidth: 2,
                borderBottomColor: appStyle.appDarkBlue,
                borderBottomWidth: 2,
              }}
            >
              <FontAwesomeIcon
                icon={faUserGroup}
                size={60}
                color={appStyle.appDarkBlue}
              />
              <View></View>
              <View className="flex-row">
                <View className="w-2/5 pb-3 items-center">
                  <Text
                    className="text-lg font-semibold m-1"
                    style={{ color: appStyle.appDarkBlue }}
                  >
                    Creator
                  </Text>
                  <Image
                    className="rounded-full border-2"
                    style={style.image}
                    source={{ uri: membersMap.get(workout.creator).img }}
                  />
                  <Text>{membersMap.get(workout.creator).displayName}</Text>
                </View>
                <View className="w-3/5">
                  <Text
                    className="text-lg m-1 font-semibold text-center"
                    style={{ color: appStyle.appDarkBlue }}
                  >
                    Others
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
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
});
export default WorkoutDetailsScreen;
