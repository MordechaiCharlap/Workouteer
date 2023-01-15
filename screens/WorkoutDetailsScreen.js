import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
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
import AlertDot from "../components/AlertDot";
import { onSnapshot, doc } from "firebase/firestore";
const WorkoutDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const db = firebase.db;
  const { user } = useAuth();
  const { workoutRequestsAlerts } = useAlerts();
  const isPastWorkout = route.params.isPastWorkout;
  const isCreator = route.params.isCreator;
  const [workout, setWorkout] = useState(route.params.workout);
  const [members, setMembers] = useState([]);
  const [initalLoading, setInitialLoading] = useState(true);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  useEffect(() => {
    const getMembersAndSetWorkout = async (workoutData) => {
      const membersArray = await firebase.getWorkoutMembers(workoutData);
      setMembers(membersArray);
      setWorkout(workoutData);
      setInitialLoading(false);
    };
    return onSnapshot(doc(db, "workouts", workout.id), (doc) => {
      setInitialLoading(true);
      getMembersAndSetWorkout({ id: doc.id, ...doc.data() });
    });
  }, []);
  const inviteFriends = async () => {
    navigation.push("InviteFriends", {
      workout: workout,
      membersArray: members,
    });
  };
  const calculateAge = (dateToCheck) => {
    var today = new Date();
    var age = today.getFullYear() - dateToCheck.getFullYear();
    var m = today.getMonth() - dateToCheck.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dateToCheck.getDate())) {
      age--;
    }
    return age;
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
              showsVerticalScrollIndicator={false}
              data={members}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={() => (
                <View>
                  <View className="flex-row justify-between">
                    <View
                      className="mb-2 px-2 rounded"
                      style={{ backgroundColor: appStyle.color_primary }}
                    >
                      <Text
                        className="text-xl m-1"
                        style={{ color: appStyle.color_on_primary }}
                      >
                        {timeString(workout.startingTime.toDate())}
                      </Text>
                    </View>
                    <View
                      className="mb-2 px-2 rounded"
                      style={{ backgroundColor: appStyle.color_primary }}
                    >
                      <Text
                        className="text-xl m-1"
                        style={{ color: appStyle.color_on_primary }}
                      >
                        {workout.city}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row flex-1">
                    <View className="aspect-square p-2">
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
                          className={
                            Platform.OS != "web"
                              ? "text-lg font-semibold"
                              : "text-sm font-semibold"
                          }
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
                          className={
                            Platform.OS != "web"
                              ? "text-lg font-semibold"
                              : "text-sm font-semibold"
                          }
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
                    <View>
                      <View
                        className="my-2 p-2 rounded-xl"
                        style={{ backgroundColor: appStyle.color_primary }}
                      >
                        <Text
                          className={Platform.OS != "web" ? "text-xl" : ""}
                          style={{ color: appStyle.color_on_primary }}
                        >
                          {workout.description}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View>
                    <View className="p-2 flex-row justify-center items-center">
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
                  onPress={async () =>
                    item.id == user.id
                      ? navigation.navigate("MyUser")
                      : navigation.navigate("User", {
                          shownUser: item,
                          friendshipStatus:
                            await firebase.checkFriendShipStatus(user, item.id),
                        })
                  }
                  className="p-1 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center">
                    <Image
                      className="rounded-full"
                      style={[
                        style.image,
                        {
                          borderColor: item.isMale
                            ? appStyle.color_male
                            : appStyle.color_female,
                        },
                      ]}
                      source={{ uri: item.img }}
                    />
                    <View className="ml-2">
                      <Text
                        className="text-xl font-semibold tracking-wider"
                        style={{ color: appStyle.color_primary }}
                      >
                        {item.displayName}
                      </Text>
                      <Text
                        className="text-md opacity-60 tracking-wider"
                        style={{ color: appStyle.color_primary }}
                      >
                        {item.displayName},{" "}
                        {calculateAge(item.birthdate.toDate())}
                      </Text>
                    </View>
                  </View>
                  {item.id == user.id && (
                    <View
                      className="rounded-lg p-1"
                      style={{
                        marginRight: item.id == workout.creator ? 0 : 20,
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

                  {item.id == workout.creator && (
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
                          className="m-2 py-2 px-4 rounded flex-row items-center"
                          onPress={() => {
                            navigation.navigate("WorkoutRequests", {
                              workout: workout,
                            });
                          }}
                          style={{ backgroundColor: appStyle.color_primary }}
                        >
                          <Text
                            style={{ color: appStyle.color_on_primary }}
                            className="text-lg"
                          >
                            Requests:{" "}
                          </Text>
                          <AlertDot
                            text={
                              workoutRequestsAlerts[workout.id].requestsCount
                            }
                            color={appStyle.color_on_primary}
                            size={20}
                          />
                        </TouchableOpacity>
                      </View>
                    )}

                  <View>
                    {Platform.OS != "web" &&
                    (route.params.userMemberStatus == "member" ||
                      route.params.userMemberStatus == "creator" ||
                      route.params.userMemberStatus == "invited") ? (
                      <View>
                        <View className="flex-row items-center p-2 justify-center">
                          <Text
                            className="text-lg"
                            style={{ color: appStyle.color_primary }}
                          >
                            Exact location
                          </Text>
                          <FontAwesomeIcon
                            icon={faLocationDot}
                            size={30}
                            color={appStyle.color_primary}
                          />
                        </View>
                        <WorkoutPinnedLocation ltLng={workout.location} />
                      </View>
                    ) : (
                      <View>
                        <Text
                          style={{
                            color: appStyle.color_on_primary,
                            backgroundColor: appStyle.color_primary,
                          }}
                          className={
                            Platform.OS != "web"
                              ? "text-center py-3 px-4"
                              : "text-center text-sm py-2 px-3"
                          }
                        >
                          {
                            "Only workout members that are using portable device (not PC) can see location on map"
                          }
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            />
          </View>
          {isCreator && !isPastWorkout && members.length < 10 && (
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
    borderWidth: 2,
    borderColor: appStyle.color_primary,
  },
  map: {
    width: 300,
    height: 300,
  },
});

export default WorkoutDetailsScreen;
