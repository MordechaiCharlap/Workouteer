import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  faStopwatch,
  faUserGroup,
  faLocationDot,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";
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
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
const WorkoutDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [isFutureWorkout, setIsFutureWorkout] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const workout = route.params.workout;
  const [membersArray, setMembersArray] = useState([]);
  const [initalLoading, setInitialLoading] = useState(true);
  useEffect(() => {
    if (workout.creator == user.usernameLower) setIsCreator(true);
    if (workout.startingTime.toDate() > new Date().getDate())
      setIsFutureWorkout(true);
    const getMembersData = async () => {
      const membersIdMap = new Map(Object.entries(workout.members));
      const usersData = await firebase.getUsers(membersIdMap);
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
          <View
            style={{ backgroundColor: appStyle.appLightBlue }}
            className="rounded"
          >
            <View
              className="flex-row justify-between"
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
              <Text
                className="text-xl m-1"
                style={{ color: appStyle.appDarkBlue }}
              >
                {workout.city}
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
              <View className="px-2 pl-5 flex-1 justify-evenly">
                <View className="flex-row items-center">
                  <FontAwesomeIcon
                    icon={faVenusMars}
                    size={40}
                    color={appStyle.appDarkBlue}
                  />
                  <Text
                    className="text-lg font-semibold"
                    style={{
                      color: appStyle.appDarkBlue,
                    }}
                  >
                    :
                    {workout.sex == "everyone"
                      ? "For everyone"
                      : workout.sex == "men"
                      ? "Men only"
                      : "Women only"}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <FontAwesomeIcon
                    icon={faStopwatch}
                    size={40}
                    color={appStyle.appDarkBlue}
                  />
                  <Text
                    className="text-lg font-semibold"
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
              style={{
                borderTopColor: appStyle.appDarkBlue,
                borderTopWidth: 2,
                borderBottomColor: appStyle.appDarkBlue,
                borderBottomWidth: 2,
              }}
            >
              <View className="flex-row items-center p-2 justify-center">
                <FontAwesomeIcon
                  icon={faUserGroup}
                  size={30}
                  color={appStyle.appDarkBlue}
                />
                <Text
                  className="text-lg"
                  style={{ color: appStyle.appDarkBlue }}
                >
                  Members
                </Text>
              </View>

              <FlatList
                data={membersArray}
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
                    {item.usernameLower == workout.creator && (
                      <Text
                        style={{ color: appStyle.appDarkBlue }}
                        className="mr-5"
                      >
                        Creator
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
            <View>
              <View className="flex-row items-center p-2 justify-center">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  size={30}
                  color={appStyle.appDarkBlue}
                />
                <Text
                  className="text-lg"
                  style={{ color: appStyle.appDarkBlue }}
                >
                  Location
                </Text>
              </View>
              <WorkoutLocation ltLng={workout.location} />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const WorkoutLocation = (props) => {
  return (
    <View style={{ height: 500 }} className="items-center">
      <View
        className="items-center"
        style={{ borderWidth: 1, borderColor: appStyle.appDarkBlue }}
      >
        <MapView
          style={style.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          initialRegion={{
            latitude: props.ltLng.latitude,
            longitude: props.ltLng.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={props.ltLng} />
        </MapView>
        <TouchableOpacity
          className="absolute bottom-4 rounded p-2"
          style={{
            backgroundColor: appStyle.appLightBlue,
            borderColor: appStyle.appDarkBlue,
            borderWidth: 1,
          }}
          onPress={() => saveLocation()}
        >
          <Text
            className="text-1xl font-semibold"
            style={{ color: appStyle.appDarkBlue }}
          >
            Directions
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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

export default WorkoutDetailsScreen;
