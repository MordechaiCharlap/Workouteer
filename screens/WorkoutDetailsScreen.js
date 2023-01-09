import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  StatusBar,
} from "react-native";
import {
  faStopwatch,
  faUserGroup,
  faLocationDot,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { workoutTypes } from "../components/WorkoutType";
import React, {
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header";
import responsiveStyle from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { timeString } from "../services/timeFunctions";
import * as firebase from "../services/firebase";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import LoadingAnimation from "../components/LoadingAnimation";
import useAuth from "../hooks/useAuth";
import useAlerts from "../hooks/useAlerts";
const WorkoutDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { workoutRequestsAlerts } = useAlerts();
  const isPastWorkout = route.params.isPastWorkout;
  const isCreator = route.params.isCreator;
  const workout = route.params.workout;
  const [membersArray, setMembersArray] = useState([]);
  const [initalLoading, setInitialLoading] = useState(true);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  useFocusEffect(
    useCallback(() => {
      const getUsersData = async () => {
        const usersData = await firebase.getWorkoutMembers(workout);
        setMembersArray(usersData);
        setInitialLoading(false);
      };
      if (route.params.changesMade) {
        getUsersData();
      }
    }, [])
  );
  useEffect(() => {
    const getUsersData = async () => {
      const usersData = await firebase.getWorkoutMembers(workout);
      setMembersArray(usersData);
      setInitialLoading(false);
    };
    getUsersData();
  }, []);
  const inviteFriends = async () => {
    navigation.push("InviteFriends", {
      membersArray: membersArray,
    });
  };
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Header title={"Details"} goBackOption={true} />
      {initalLoading ? (
        <LoadingAnimation />
      ) : (
        <View className="flex-1 mx-4">
          <View className="rounded flex-1">
            <FlatList
              data={membersArray}
              keyExtractor={(item) => item.usernameLower}
              ListHeaderComponent={() => (
                <View>
                  <View
                    className="flex-row justify-between"
                    style={{
                      borderBottomColor: appStyle.color_primary,
                      borderBottomWidth: 2,
                    }}
                  >
                    <Text
                      className="text-xl m-1"
                      style={{ color: appStyle.color_primary }}
                    >
                      Date: {timeString(workout.startingTime.toDate())}
                    </Text>
                    <Text
                      className="text-xl m-1"
                      style={{ color: appStyle.color_primary }}
                    >
                      {workout.city}
                    </Text>
                  </View>
                  <View className="flex-row flex-1">
                    <View
                      className="aspect-square p-2"
                      style={{
                        borderRightColor: appStyle.color_primary,
                        borderRightWidth: 2,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={workoutTypes[workout.type].icon}
                        size={120}
                        color={appStyle.color_primary}
                      />
                    </View>
                    <View className="px-2 pl-5 flex-1 justify-evenly">
                      <View className="flex-row items-center">
                        <FontAwesomeIcon
                          icon={faVenusMars}
                          size={40}
                          color={appStyle.color_primary}
                        />
                        <Text
                          className="text-lg font-semibold"
                          style={{
                            color: appStyle.color_primary,
                          }}
                        >
                          :
                          {workout.sex == "everyone"
                            ? " For everyone"
                            : workout.sex == "men"
                            ? " Men only"
                            : " Women only"}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <FontAwesomeIcon
                          icon={faStopwatch}
                          size={40}
                          color={appStyle.color_primary}
                        />
                        <Text
                          className="text-lg font-semibold"
                          style={{
                            color: appStyle.color_primary,
                          }}
                        >
                          : {workout.minutes} minutes
                        </Text>
                      </View>
                    </View>
                  </View>
                  {workout.description != "" && (
                    <View
                      style={{
                        borderTopColor: appStyle.color_primary,
                        borderTopWidth: 2,
                      }}
                    >
                      <Text>Description: {workout.description}</Text>
                    </View>
                  )}

                  <View>
                    <View
                      className="p-2 flex-row justify-center items-center"
                      style={{
                        borderTopColor: appStyle.color_primary,
                        borderTopWidth: 2,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faUserGroup}
                        size={30}
                        color={appStyle.color_primary}
                      />
                      <Text
                        className="text-lg"
                        style={{ color: appStyle.color_primary }}
                      >
                        Members
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    item.usernameLower == user.usernameLower
                      ? {}
                      : navigation.navigate("User", { shownUser: item })
                  }
                  className="p-1 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center">
                    <Image
                      className="rounded-full"
                      style={style.image}
                      source={{ uri: item.img }}
                    />
                    <View className="ml-2">
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
                  </View>
                  {item.usernameLower == user.usernameLower && (
                    <View
                      className="rounded-lg p-1"
                      style={{
                        marginRight:
                          item.usernameLower == workout.creator ? 0 : 20,
                        backgroundColor: appStyle.color_primary,
                      }}
                    >
                      <Text
                        style={{
                          color: appStyle.color_on_primary,
                        }}
                      >
                        You!
                      </Text>
                    </View>
                  )}

                  {item.usernameLower == workout.creator && (
                    <Text
                      style={{ color: appStyle.color_primary }}
                      className="mr-5"
                    >
                      Creator
                    </Text>
                  )}
                </TouchableOpacity>
              )}
              ListFooterComponent={() => (
                <View>
                  {isCreator &&
                    workoutRequestsAlerts[workout.id] &&
                    workoutRequestsAlerts[workout.id].requestsCount > 0 && (
                      <View className="items-center">
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate("WorkoutRequests", {
                              workout: workout,
                            });
                          }}
                          className="m-2 p-2 rounded"
                          style={{ backgroundColor: appStyle.color_primary }}
                        >
                          <Text
                            style={{ color: appStyle.color_on_primary }}
                            className="text-lg"
                          >
                            Requests:{" "}
                            {workoutRequestsAlerts[workout.id].requestsCount}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                  <View
                    style={{
                      borderTopColor: appStyle.color_primary,
                      borderTopWidth: 2,
                    }}
                  >
                    <View className="flex-row items-center p-2 justify-center">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        size={30}
                        color={appStyle.color_primary}
                      />
                      <Text
                        className="text-lg"
                        style={{ color: appStyle.color_primary }}
                      >
                        Location
                      </Text>
                    </View>
                    {route.params.userMemberStatus == "member" ||
                    route.params.userMemberStatus == "creator" ? (
                      <WorkoutPinnedLocation ltLng={workout.location} />
                    ) : (
                      <View>
                        <Text
                          style={{ color: appStyle.color_primary }}
                          className="text-lg text-center"
                        >
                          {workout.country}, {workout.city}
                        </Text>
                        <Text
                          style={{ color: appStyle.color_primary }}
                          className="text-center"
                        >
                          Exact location would be shown only for members.
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            />
          </View>
          {isCreator && !isPastWorkout && membersArray.length < 10 && (
            <TouchableOpacity
              className="rounded p-1 my-1"
              style={{
                backgroundColor: appStyle.color_primary,
              }}
              onPress={inviteFriends}
            >
              <Text
                className="text-xl text-center font-semibold"
                style={{ color: appStyle.color_on_primary }}
              >
                Invite friends to join
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const WorkoutPinnedLocation = (props) => {
  const showDirections = () => {};
  return (
    <View className="items-center mb-3">
      <View
        className="items-center"
        style={{ borderWidth: 1, borderColor: appStyle.color_primary }}
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
          className="bottom-4 rounded p-2 absolute"
          style={{
            backgroundColor: appStyle.color_bg,
            borderColor: appStyle.color_primary,
            borderWidth: 1,
          }}
          onPress={() => showDirections()}
        >
          <Text
            className="text-1xl font-semibold"
            style={{ color: appStyle.color_primary }}
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
    borderColor: appStyle.color_primary,
  },
  map: {
    width: 300,
    height: 300,
  },
});

export default WorkoutDetailsScreen;
