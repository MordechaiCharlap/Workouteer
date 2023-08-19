import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  faClock,
  faUserGroup,
  faVenusMars,
  faUserClock,
  faCrown,
  faCheck,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { workoutTypes } from "../components/WorkoutType";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header";
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as appStyle from "../utils/appStyleSheet";
import { timeString } from "../utils/timeFunctions";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
import useAlerts from "../hooks/useAlerts";
import AlertDot from "../components/AlertDot";
import { onSnapshot, doc } from "firebase/firestore";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import languageService from "../services/languageService";
import CustomButton from "../components/basic/CustomButton";
import useFirebase from "../hooks/useFirebase";
import CustomText from "../components/basic/CustomText";
import usePushNotifications from "../hooks/usePushNotifications";
import { useWorkoutLogic } from "../hooks/useWorkoutLogic";
import useFriendsWorkouts from "../hooks/useFriendsWorkouts";
import LoadingAnimation from "../components/LoadingAnimation";
import useCurrentWorkout from "../hooks/useCurrentWorkout";
import appComponentsDefaultStyles from "../utils/appComponentsDefaultStyles";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { getMemberStatus } from "../utils/workoutUtils";

const WorkoutDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();
  const { currentWorkout } = useCurrentWorkout();
  const { user } = useAuth();
  if (route.params.workout == null) navigation.replace("WorkoutNotFound");
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("WorkoutDetails");
    }, [])
  );
  const {
    sendPushNotificationUserJoinedYouwWorkout,
    sendPushNotificationUserLeftWorkout,
    schedulePushNotification,
    cancelScheduledPushNotification,
    sendPushNotificationUserWantsToJoinYourWorkout,
  } = usePushNotifications();
  const { checkIfWorkoutOnPlannedWorkoutTime } = useWorkoutLogic();
  const { updateArrayIfNeedForWorkout } = useFriendsWorkouts();
  const { db } = useFirebase();
  const { workoutRequestsAlerts } = useAlerts();
  const [workout, setWorkout] = useState(route.params.workout);
  const [isPastWorkout, setIsPastWorkout] = useState(
    workout.startingTime.toDate() < new Date()
  );
  const [isCreator, setIsCreator] = useState(workout.creator == user.id);
  const [userMemberStatus, setUserMemberStatus] = useState(
    route.params.userMemberStatus || getMemberStatus(user.id, workout)
  );
  const [members, setMembers] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  useEffect(() => {
    if (!workout) return;
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
  const joinWorkoutButtonText = () => {
    switch (userMemberStatus) {
      case "not":
        return languageService[user.language].requestToJoin[
          user.isMale ? 1 : 0
        ];
      case "pending":
        return languageService[user.language].cancelRequest[
          user.isMale ? 1 : 0
        ];
      case "member":
        return languageService[user.language].leaveWorkout;
      case "invited":
        return languageService[user.language].acceptInvite[user.isMale ? 1 : 0];
    }
  };
  const joinWorkoutButtonClicked = () => {
    switch (userMemberStatus) {
      case "not":
        return requestToJoinWorkout();
      case "pending":
        return cancelWorkoutRequest();
      case "member":
        return leaveWorkout();
      case "invited":
        return acceptWorkoutInvite();
    }
  };
  const requestToJoinWorkout = async () => {
    if (checkIfWorkoutOnPlannedWorkoutTime(user, workout) != null) return;
    setUserMemberStatus("pending");
    const workoutClone = JSON.parse(JSON.stringify(workout));
    workoutClone.requests[user.id] = true;
    firebase.requestToJoinWorkout(user.id, workout);
    const creatorData = firebase.getUserDataById(workout.creator);
    sendPushNotificationUserWantsToJoinYourWorkout(user, creatorData, workout);
  };
  const cancelWorkoutRequest = async () => {
    setUserMemberStatus("not");
    const workoutClone = JSON.parse(JSON.stringify(workout));
    delete workoutClone.requests[user.id];
    updateArrayIfNeedForWorkout(workoutClone);
    await firebase.cancelWorkoutRequest(user.id, workout);
  };
  const acceptWorkoutInvite = async () => {
    const workoutRef = workout;
    setUserMemberStatus("member");
    var scheduledNotificationId;
    if (Platform.OS != "web") {
      scheduledNotificationId = await schedulePushNotification(
        workoutRef.startingTime.toDate(),
        "Workouteer",
        languageService[user.language].confirmYourWorkout[user.isMale ? 1 : 0],
        { type: "workoutDetails", workoutId: workout.id }
      );
    }

    await firebase.acceptWorkoutInvite(
      user,
      workoutRef,
      scheduledNotificationId
    );
    sendPushNotificationUserJoinedYouwWorkout(workoutRef, user, user.id);
  };
  const rejectWorkoutInvite = async () => {
    setUserMemberStatus("not");
    const workoutRef = JSON.parse(JSON.stringify(workout));
    if (props.screen == "WorkoutInvites") setWorkout(null);
    else {
      const workoutClone = JSON.parse(JSON.stringify(workout));
      workoutClone.invites[user.id] = false;
      updateArrayIfNeedForWorkout(workoutClone);
    }

    await firebase.rejectWorkoutInvite(user.id, workoutRef);
  };
  const leaveWorkout = async () => {
    const workoutRef = workout;
    if (props.screen == "FutureWorkouts") setWorkout(null);
    else setUserMemberStatus("not");
    firebase.leaveWorkout(user, workoutRef);
    cancelScheduledPushNotification(workout.members[user.id].notificationId);
    sendPushNotificationUserLeftWorkout(workoutRef, user.id, user.displayName);
  };
  const containerColor = appStyle.color_surface_variant;
  const onContainerColor = appStyle.color_on_background;
  return (
    <View style={safeAreaStyle()}>
      <Header
        title={languageService[user.language].details}
        goBackOption={true}
      />
      {initialLoading ? (
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
                  onPress={() =>
                    item.id == user.id
                      ? navigation.navigate("MyProfile")
                      : navigation.navigate("Profile", {
                          shownUser: item,
                        })
                  }
                  className="p-1 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center">
                    <View>
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
                      {item.id == workout.creator && (
                        <View
                          className="absolute"
                          style={{
                            borderRadius: 999,
                            backgroundColor: appStyle.color_surface_variant,
                            bottom: 0,
                            left: 0,
                            padding: 3,
                            borderColor: appStyle.color_background,
                            borderWidth: 2,
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faCrown}
                            color={appStyle.color_on_surface_variant}
                            size={10}
                          />
                        </View>
                      )}
                    </View>
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
                  {workout.members[user.id].confirmedWorkout && (
                    <View
                      style={{
                        backgroundColor: appStyle.color_surface_variant,
                        padding: 5,
                        borderRadius: 999,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        size={20}
                        color={appStyle.color_on_surface_variant}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )}
      {!initialLoading &&
        !isPastWorkout &&
        (isCreator && members.length < 10 ? (
          <View
            className="flex-row"
            style={{ paddingHorizontal: 16, paddingVertical: 6 }}
          >
            <CustomButton
              round
              style={{ flex: 1, backgroundColor: appStyle.color_tertiary }}
              onPress={inviteFriends}
            >
              <Text
                className="text-xl font-semibold text-center"
                style={{ color: appStyle.color_on_tertiary }}
              >
                {languageService[user.language].inviteFriendsToJoin}
              </Text>
            </CustomButton>
            {workoutRequestsAlerts[workout.id] &&
              workoutRequestsAlerts[workout.id].requestsCount > 0 && (
                <View className="flex-row">
                  <View style={{ width: 10 }} />
                  <CustomButton
                    round
                    className={`items-center flex-row${
                      user.language == "hebrew" ? "-reverse" : ""
                    }`}
                    onPress={() => {
                      navigation.navigate("WorkoutRequests", {
                        workout: workout,
                      });
                    }}
                    style={{ backgroundColor: appStyle.color_error }}
                  >
                    <FontAwesomeIcon
                      icon={faUserClock}
                      color={appStyle.color_background}
                      size={30}
                    />
                    <View style={{ width: 10 }} />
                    <AlertDot
                      text={workoutRequestsAlerts[workout.id].requestsCount}
                      textColor={appStyle.color_error}
                      color={appStyle.color_on_primary}
                      size={20}
                    />
                  </CustomButton>
                </View>
              )}
          </View>
        ) : (
          !isCreator &&
          userMemberStatus != "cannot" &&
          userMemberStatus != "rejected" &&
          route.params.cameFromPushNotification == true && (
            <View className="flex-row" style={{ padding: 16, columnGap: 5 }}>
              <CustomButton
                className="flex-1"
                round
                onPress={joinWorkoutButtonClicked}
                style={{
                  padding: 16,
                  borderWidth: 0.5,
                  borderColor: appStyle.color_on_background,
                  backgroundColor:
                    userMemberStatus == "pending"
                      ? appStyle.color_background
                      : appStyle.color_on_background,
                }}
              >
                <CustomText
                  className="font-black text-lg"
                  style={{
                    color:
                      userMemberStatus == "pending"
                        ? appStyle.color_on_background
                        : appStyle.color_background,
                  }}
                >
                  {joinWorkoutButtonText()}
                </CustomText>
              </CustomButton>
              {userMemberStatus == "invited" && (
                <CustomButton
                  className="flex-1"
                  round
                  onPress={rejectWorkoutInvite}
                  style={{
                    padding: 16,
                    borderWidth: 0.5,
                    borderColor: appStyle.color_on_background,
                    backgroundColor: appStyle.color_background,
                  }}
                >
                  <CustomText
                    className="font-black text-lg"
                    style={{
                      color: appStyle.color_on_background,
                    }}
                  >
                    {
                      languageService[user.language].rejectInvite[
                        user.isMale ? 1 : 0
                      ]
                    }
                  </CustomText>
                </CustomButton>
              )}
            </View>
          )
        ))}
      {!initialLoading &&
        workout.id == currentWorkout?.id &&
        workout.members[user.id]?.confirmedWorkout == false && (
          <ConfirmedButton />
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
        <Marker
          coordinate={{
            latitude: props.ltLng.latitude,
            longitude: props.ltLng.longitude,
          }}
        />
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
const ConfirmedButton = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const buttonSize = useSharedValue(100);
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${buttonSize.value}%`,
    };
  });
  useFocusEffect(
    useCallback(() => {
      buttonSize.value = 100;
      buttonSize.value = withRepeat(
        withTiming(70, {
          duration: 500,
        }),
        2,
        true
      );
    }, [])
  );
  return (
    <Animated.View
      style={[
        {
          paddingHorizontal: 16,
          paddingVertical: 6,
          alignSelf: "center",
        },
        buttonAnimatedStyle,
      ]}
    >
      <CustomButton
        round
        style={{
          backgroundColor: appStyle.color_tertiary,
          width: "100%",
        }}
        onPress={() => {
          navigation.replace("ConfirmWorkout");
        }}
      >
        <CustomText
          className="text-xl font-semibold text-center"
          style={{ color: appStyle.color_on_tertiary }}
        >
          {languageService[user.language].confirmWorkout[user.isMale ? 1 : 0]}
        </CustomText>
      </CustomButton>
    </Animated.View>
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
