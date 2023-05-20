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
  faClock,
  faUserGroup,
  faLocationDot,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { workoutTypes } from "../components/WorkoutType";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header";
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as appStyle from "../utilities/appStyleSheet";
import { timeString } from "../services/timeFunctions";
import * as firebase from "../services/firebase";
import LoadingAnimation from "../components/LoadingAnimation";
import useAuth from "../hooks/useAuth";
import useAlerts from "../hooks/useAlerts";
import AlertDot from "../components/AlertDot";
import { onSnapshot, doc } from "firebase/firestore";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import languageService from "../services/languageService";
import CustomButton from "../components/basic/CustomButton";

const WorkoutDetailsScreen = ({ route }) => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("WorkoutDetails");
    }, [])
  );
  const navigation = useNavigation();
  const db = firebase.db;
  const { user } = useAuth();
  const { workoutRequestsAlerts } = useAlerts();
  const isPastWorkout = route.params.isPastWorkout;
  const isCreator = route.params.isCreator;
  const [workout, setWorkout] = useState(route.params.workout);
  const [members, setMembers] = useState([]);
  const [initalLoading, setInitialLoading] = useState(true);
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
    navigation.navigate("InviteFriends", {
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
  const containerColor = appStyle.color_surface_variant;
  const onContainerColor = appStyle.color_on_background;
  return (
    <View style={safeAreaStyle()}>
      <Header
        title={languageService[user.language].details}
        goBackOption={true}
      />
      {initalLoading ? (
        <LoadingAnimation />
      ) : (
        <View className="flex-1 mx-4">
          <View className="flex-1 ">
            <FlatList
              showsVerticalScrollIndicator={false}
              data={members}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={() => (
                <View>
                  <View className="flex-row items-center">
                    <View className="w-1 flex-1">
                      <View
                        className="rounded justify-center px-2"
                        style={{
                          backgroundColor: containerColor,
                          height: 40,
                        }}
                      >
                        <Text
                          className="text-md text-left"
                          style={{ color: onContainerColor }}
                        >
                          {timeString(
                            workout.startingTime.toDate(),
                            user.language
                          )}
                        </Text>
                      </View>
                    </View>
                    <View>
                      <View
                        className="rounded-full p-2 mx-2"
                        style={{
                          backgroundColor: containerColor,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={workoutTypes[workout.type].icon}
                          size={25}
                          color={onContainerColor}
                        />
                      </View>
                    </View>
                    <View className="w-1 flex-1">
                      <View
                        className="rounded px-2 justify-center"
                        style={{
                          backgroundColor: containerColor,
                          height: 40,
                        }}
                      >
                        <Text
                          className="text-md text-right"
                          style={{ color: onContainerColor }}
                        >
                          {workout.city[user.language]
                            ? workout.city[user.language]
                            : workout.city["english"]}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    className="p-3 rounded mt-2"
                    style={{ backgroundColor: containerColor }}
                  >
                    <View
                      className={`items-center justify-between flex-row${
                        user.language == "hebrew" ? "-reverse" : ""
                      }`}
                    >
                      <View
                        className={`items-center gap-x-2 flex-row${
                          user.language == "hebrew" ? "-reverse" : ""
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={faVenusMars}
                          size={25}
                          color={onContainerColor}
                        />
                        <Text
                          className={
                            Platform.OS != "web"
                              ? "text-md font-semibold ml-1"
                              : "text-sm font-semibold"
                          }
                          style={{
                            color: onContainerColor,
                          }}
                        >
                          {workout.sex == "everyone"
                            ? languageService[user.language].forEveryone
                            : workout.sex == "men"
                            ? languageService[user.language].menOnly
                            : languageService[user.language].womenOnly}
                        </Text>
                      </View>
                      <View
                        className={`items-center gap-x-2 flex-row${
                          user.language == "hebrew" ? "-reverse" : ""
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={faClock}
                          size={25}
                          color={onContainerColor}
                        />
                        <Text
                          className={
                            Platform.OS != "web"
                              ? "text-md font-semibold ml-1"
                              : "text-sm font-semibold ml-1"
                          }
                          style={{
                            color: onContainerColor,
                          }}
                        >
                          {workout.minutes +
                            " " +
                            languageService[user.language].minutes}
                        </Text>
                      </View>
                    </View>
                    {workout.description != "" && (
                      <Text
                        className={
                          Platform.OS != "web" ? "text-sm mt-2" : "mt-2"
                        }
                        style={{ color: onContainerColor }}
                      >
                        {workout.description}
                      </Text>
                    )}
                  </View>
                  <View>
                    {workout.members[user.id] != null ||
                    workout.invites[user.id] != null ? (
                      <View>
                        <View className="mt-2 items-center justify-center">
                          <WorkoutPinnedLocation
                            backgroundColor={appStyle.color_outline}
                            ltLng={workout.location}
                            language={user.language}
                          />
                        </View>
                      </View>
                    ) : (
                      <View
                        className="mt-2 rounded"
                        style={{
                          backgroundColor: containerColor,
                        }}
                      >
                        <Text
                          style={{
                            color: onContainerColor,
                          }}
                          className={
                            Platform.OS != "web"
                              ? "text-center py-3 px-4"
                              : "text-center text-sm py-2 px-3"
                          }
                        >
                          {
                            languageService[user.language]
                              .onlyWorkoutMembersCanSeeLocation
                          }
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="mt-2 items-center">
                    <View className="flex-row justify-center items-center rounded p-2">
                      <FontAwesomeIcon
                        icon={faUserGroup}
                        size={25}
                        color={onContainerColor}
                      />
                      <Text
                        className="text-md"
                        style={{ color: onContainerColor }}
                      >
                        {languageService[user.language].members}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={async () =>
                    item.id == user.id
                      ? navigation.navigate("MyProfile")
                      : navigation.navigate("Profile", {
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
                        className="text-md font-semibold tracking-wider"
                        style={{ color: appStyle.color_on_background }}
                      >
                        {calculateAge(item.birthdate.toDate())},{" "}
                        {item.displayName}
                      </Text>
                      <Text
                        className="text-sm opacity-60 tracking-wider"
                        style={{ color: appStyle.color_on_background }}
                      >
                        {item.id}
                      </Text>
                    </View>
                  </View>
                  {/* {item.id == user.id && (
                    <View
                      className="rounded-lg p-1"
                      style={{
                        marginRight: item.id == workout.creator ? 0 : 20,
                        backgroundColor: appStyle.color_on_background,
                      }}
                    >
                      <Text
                        style={{
                          color: appStyle.color_on_on_background,
                        }}
                      >
                        {
                          languageService[user.language].you[
                            user.isMale ? 1 : 0
                          ]
                        }
                      </Text>
                    </View>
                  )} */}

                  {item.id == workout.creator && (
                    <Text
                      style={{ color: appStyle.color_on_background }}
                      className="mr-5"
                    >
                      {
                        languageService[user.language].creator[
                          user.isMale ? 1 : 0
                        ]
                      }
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
                            {languageService[user.language].requests}:{" "}
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
                </View>
              )}
            />
          </View>
        </View>
      )}
      {isCreator && !isPastWorkout && members.length < 10 && (
        <View
          className="px-2"
          style={{
            borderTopWidth: 1,
            borderTopColor: appStyle.color_outline,
          }}
        >
          <CustomButton
            style={{
              borderRadius: 999,
              marginVertical: 5,
              backgroundColor: appStyle.color_on_background,
            }}
            onPress={inviteFriends}
          >
            <Text
              className="text-xl text-center font-semibold"
              style={{ color: appStyle.color_background }}
            >
              {languageService[user.language].inviteFriendsToJoin}
            </Text>
          </CustomButton>
        </View>
      )}
    </View>
  );
};

const WorkoutPinnedLocation = (props) => {
  const { default: MapView, PROVIDER_GOOGLE } = require("react-native-maps");
  const { Marker } = require("../services/mapsService");
  return (
    <View
      className="items-center justify-center p-2 rounded-lg w-full aspect-square"
      style={{
        backgroundColor: props.backgroundColor
          ? props.backgroundColor
          : appStyle.color_on_background,
      }}
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
      {/* <TouchableOpacity
        className="bottom-4 rounded py-2 px-6 absolute"
        style={{
          backgroundColor: appStyle.color_primary,
          borderColor: appStyle.color_background,
          borderWidth: 1,
        }}
        onPress={() => showDirections()}
      >
        <Text
          className="text-1xl font-semibold"
          style={{ color: appStyle.color_on_primary }}
        >
          {languageService[props.language].directions}
        </Text>
      </TouchableOpacity> */}
    </View>
  );
};
const style = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
    borderWidth: 1.5,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default WorkoutDetailsScreen;
