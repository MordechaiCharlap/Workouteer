import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import * as appStyle from "../utilities/appStyleSheet";
import * as firebase from "../services/firebase";
import { workoutTypes } from "../components/WorkoutType";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faLocationDot,
  faStopwatch,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { getDistance } from "geolib";
import { useNavigation } from "@react-navigation/native";
import { timeString } from "../services/timeFunctions";
import AlertDot from "../components/AlertDot";
import useAuth from "../hooks/useAuth";
import useAlerts from "../hooks/useAlerts";
import usePushNotifications from "../hooks/usePushNotifications";
import { deleteField, doc, updateDoc } from "firebase/firestore";
import languageService from "../services/languageService";
const WorkoutComponent = (props) => {
  const navigation = useNavigation();

  const { user } = useAuth();
  const { workoutRequestsAlerts } = useAlerts();
  const {
    sendPushNotificationUserJoinedYouwWorkout,
    sendPushNotificationUserLeftWorkout,
    schedulePushNotification,
    sendPushNotificationCreatorLeftWorkout,
    cancelScheduledPushNotification,
    sendPushNotificationUserWantsToJoinYourWorkout,
  } = usePushNotifications();
  const [workout, setWorkout] = useState(props.workout);
  const [userMemberStatus, setUserMemberStatus] = useState(null);
  const [distance, setDistance] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const isPastWorkout = props.isPastWorkout;
  const isCreator = props.workout.creator == user.id;
  useEffect(() => {
    if (!isPastWorkout && workout) {
      if (isCreator) {
        setUserMemberStatus("creator");
      } else if (workout.members[user.id] != null) {
        setUserMemberStatus("member");
      } else if (workout.invites[user.id] != null) {
        setUserMemberStatus("invited");
      } else if (workout.requests[user.id] != null) {
        if (workout.requests[user.id] == true) {
          setUserMemberStatus("pending");
        } else {
          setUserMemberStatus("rejected");
          setWorkout(null);
        }
      } else {
        setUserMemberStatus("not");
      }
    }
    if (props.location) {
      const distance = getDistance(props.location, workout.location);
      setDistance(Math.ceil(distance / 1000));
    }
  }, []);
  const leaveWorkout = async () => {
    const workoutRef = workout;
    if (props.screen == "FutureWorkouts") setWorkout(null);
    else setUserMemberStatus("not");
    await firebase.leaveWorkout(user, workoutRef);
    await cancelScheduledPushNotification(workout.members[user.id]);
    await sendPushNotificationUserLeftWorkout(
      workoutRef,
      user.id,
      user.displayName
    );
  };
  const renderMembersPics = () => {
    const picsArr = Object.values(workout.members);
    const imageList = picsArr.map((imgUri) => (
      <Image
        key={imgUri}
        source={{ uri: imgUri }}
        className="w-6 h-6 rounded-full bg-white"
      />
    ));
    return (
      <View
        className={`items-center flex-row${
          user.language == "hebrew" ? "-reverse" : ""
        }`}
      >
        {imageList}
      </View>
    );
  };
  const cancelWorkout = async () => {
    var workoutRef = workout;
    setWorkout(null);
    if (Object.entries(workoutRef.members).size > 1) {
      for (var member of Object.keys(workoutRef.members)) {
        if (member != user.id) {
          workoutRef.creator = member;
          break;
        }
      }
      await sendPushNotificationCreatorLeftWorkout(
        workoutRef,
        user.id,
        user.displayName,
        newCreatorIsMale
      );
      await updateDoc(doc(firebase.db, `workouts/${workoutRef.id}`), {
        creator: workoutRef.creator,
        [`members.${user.id}`]: deleteField(),
      });
    } else {
      await firebase.cancelWorkout(user, workoutRef);
    }
    await cancelScheduledPushNotification(workoutRef.members[user.id]);
  };
  const requestToJoinWorkout = async () => {
    setUserMemberStatus("pending");
    await firebase.requestToJoinWorkout(user.id, workout);
    const creatorData = firebase.getUserDataById(workout.creator);
    await sendPushNotificationUserWantsToJoinYourWorkout(user, creatorData);
  };
  const cancelWorkoutRequest = async () => {
    setUserMemberStatus("not");
    await firebase.cancelWorkoutRequest(user.id, workout);
  };
  const acceptWorkoutInvite = async () => {
    const workoutRef = workout;
    if (props.screen == "WorkoutInvites") setWorkout(null);
    setUserMemberStatus("member");
    var scheduledNotificationId;
    if (Platform.OS != "web") {
      scheduledNotificationId = await schedulePushNotification(
        workoutRef.startingTime.toDate(),
        "Workouteer",
        languageService[user.language].confirmYourWorkout[user.isMale]
      );
    }

    await firebase.acceptWorkoutInvite(
      user,
      workoutRef,
      scheduledNotificationId
    );
    await sendPushNotificationUserJoinedYouwWorkout(workoutRef, user, user.id);
  };
  const rejectWorkoutInvite = async () => {
    setUserMemberStatus("not");
    if (props.screen == "WorkoutInvites") setWorkout(null);
    const workoutRef = workout;
    await firebase.rejectWorkoutInvite(user.id, workoutRef);
  };
  const getWorkoutActionButtons = () => {
    switch (userMemberStatus) {
      case "invited":
        return (
          <View
            className={`mt-1 flex-row${
              user.language == "hebrew" ? "-reverse" : ""
            }`}
          >
            <TouchableOpacity
              onPress={acceptWorkoutInvite}
              className="mx-1 h-8 rounded flex-1 justify-center"
              style={{
                backgroundColor: appStyle.color_bg_variant,
              }}
            >
              <Text
                className="text-center font-semibold"
                style={{
                  color: appStyle.color_on_primary,
                }}
              >
                {buttonLoading == "acceptLoading"
                  ? languageService[user.language].loading
                  : languageService[user.language].acceptInvite[
                      user.isMale ? 1 : 0
                    ]}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={rejectWorkoutInvite}
              className="mx-1 h-8 rounded flex-1 justify-center"
              style={{
                backgroundColor: appStyle.color_bg,
                borderColor: appStyle.color_primary,
                borderWidth: 1,
              }}
            >
              <Text
                className="text-center font-semibold"
                style={{
                  color: appStyle.color_primary,
                }}
              >
                {buttonLoading == "rejectLoading"
                  ? languageService[user.language].loading
                  : languageService[user.language].rejectInvite[
                      user.isMale ? 1 : 0
                    ]}
              </Text>
            </TouchableOpacity>
          </View>
        );
      case "creator":
        return (
          <TouchableOpacity
            onPress={cancelWorkout}
            className="mx-1 h-8 rounded flex-1 justify-center"
            style={{
              backgroundColor: appStyle.color_bg,
              borderColor: appStyle.color_primary,
              borderWidth: 1,
            }}
          >
            <Text
              className="text-center"
              style={{
                color: appStyle.color_primary,
              }}
            >
              {buttonLoading
                ? languageService[user.language].loading
                : languageService[user.language].cancelWorkout}
            </Text>
          </TouchableOpacity>
        );
      case "member":
        return (
          <TouchableOpacity
            onPress={leaveWorkout}
            className="mx-1 h-8 rounded flex-1 justify-center"
            style={{
              backgroundColor: appStyle.color_bg,
              borderColor: appStyle.color_primary,
              borderWidth: 1,
            }}
          >
            <Text
              className="text-center"
              style={{
                color: appStyle.color_primary,
              }}
            >
              {buttonLoading
                ? languageService[user.language].loading
                : languageService[user.language].leave[user.isMale ? 1 : 0]}
            </Text>
          </TouchableOpacity>
        );
      case "pending":
        return (
          <TouchableOpacity
            onPress={cancelWorkoutRequest}
            className="mx-1 h-8 rounded flex-1 justify-center"
            style={{
              backgroundColor: appStyle.color_bg,
              borderColor: appStyle.color_primary,
              borderWidth: 1,
            }}
          >
            <Text
              className="text-center"
              style={{
                color: appStyle.color_primary,
              }}
            >
              {buttonLoading
                ? languageService[user.language].loading
                : languageService[user.language].cancelWorkoutRequest}
            </Text>
          </TouchableOpacity>
        );
      case "not":
        return (
          <TouchableOpacity
            onPress={requestToJoinWorkout}
            className="mx-1 h-8 rounded flex-1 justify-center"
            style={{
              backgroundColor: appStyle.color_bg,
              borderColor: appStyle.color_primary,
              borderWidth: 1,
            }}
          >
            <Text
              className="text-center"
              style={{
                color: appStyle.color_primary,
              }}
            >
              {buttonLoading
                ? languageService[user.language].loading
                : languageService[user.language].requestToJoin[
                    user.isMale ? 1 : 0
                  ]}
            </Text>
          </TouchableOpacity>
        );
    }
  };
  if (workout != null)
    return (
      <View
        className="rounded mb-5"
        style={{
          backgroundColor: appStyle.color_bg,
          borderWidth: 2,
          borderColor: appStyle.color_primary,
        }}
      >
        <View
          className={`items-center justify-between px-2 flex-row${
            user.language == "hebrew" ? "-reverse" : ""
          }`}
          style={{
            borderBottomColor: appStyle.color_primary,
            borderBottomWidth: 2,
          }}
        >
          <Text
            className={Platform.OS != "web" ? "text-xl" : "rounded-t"}
            style={{
              color: appStyle.color_primary,
            }}
          >
            {isCreator
              ? languageService[user.language].yourWorkout
              : user.language == "hebrew"
              ? `האימון של ${workout.creator}`
              : workout.creator + "`s" + " workout"}
          </Text>
          <Text
            className={Platform.OS != "web" ? "text-xl" : "rounded-t"}
            style={{
              color: appStyle.color_primary,
            }}
          >
            {timeString(workout.startingTime.toDate(), user.language)}
          </Text>
        </View>

        <View
          className={`h-28 flex-row${
            user.language == "hebrew" ? "-reverse" : ""
          }`}
        >
          <View
            className="p-1 justify-around flex-1"
            style={
              user.language == "hebrew"
                ? {
                    borderLeftColor: appStyle.color_primary,
                    borderLeftWidth: 2,
                  }
                : {
                    borderRightColor: appStyle.color_primary,
                    borderRightWidth: 2,
                  }
            }
          >
            <View
              className={`items-center my-1 gap-x-1 flex-row${
                user.language == "hebrew" ? "-reverse" : ""
              }`}
            >
              <FontAwesomeIcon
                icon={faLocationDot}
                size={30}
                color={appStyle.color_primary}
              />
              <Text
                className="text-md"
                style={{
                  color: appStyle.color_primary,
                }}
              >
                {distance
                  ? languageService[user.language].lessThan +
                    distance +
                    " " +
                    languageService[user.language].kmAway
                  : workout.city}
              </Text>
            </View>
            <View
              className={`items-center my-1 gap-x-1 flex-row${
                user.language == "hebrew" ? "-reverse" : ""
              }`}
            >
              <FontAwesomeIcon
                icon={faStopwatch}
                size={30}
                color={appStyle.color_primary}
              />
              <Text
                className="text-md"
                style={{
                  color: appStyle.color_primary,
                }}
              >
                {workout.minutes} {languageService[user.language].minutes}
              </Text>
            </View>
            <View
              className={`items-center my-1 gap-x-1 flex-row${
                user.language == "hebrew" ? "-reverse" : ""
              }`}
            >
              <FontAwesomeIcon
                icon={faUserGroup}
                size={30}
                color={appStyle.color_primary}
              />
              <Text>{Object.keys(workout.members).length}</Text>
            </View>
          </View>
          <View className="justify-center items-center aspect-square">
            <FontAwesomeIcon
              icon={workoutTypes[workout.type].icon}
              size={45}
              color={appStyle.color_primary}
            />
          </View>
        </View>
        <View
          className="flex-1 py-1"
          style={{
            borderTopColor: appStyle.color_primary,
            borderTopWidth: 2,
            flexDirection: userMemberStatus == "invited" ? "column" : "row",
          }}
        >
          <TouchableOpacity
            className="mx-1 h-8 flex-1 rounded justify-center flex-row items-center"
            onPress={() =>
              navigation.navigate("WorkoutDetails", {
                workout: workout,
                isCreator: isCreator,
                isPastWorkout: isPastWorkout,
                userMemberStatus: userMemberStatus,
              })
            }
            style={{
              backgroundColor: appStyle.color_primary,
            }}
          >
            <Text
              style={{
                color: appStyle.color_on_primary,
              }}
            >
              {languageService[user.language].details}
            </Text>
            {!isPastWorkout &&
              isCreator &&
              workoutRequestsAlerts[workout.id] &&
              workoutRequestsAlerts[workout.id].requestsCount > 0 && (
                <View className="ml-5">
                  <AlertDot
                    text={workoutRequestsAlerts[workout.id].requestsCount}
                    color={appStyle.color_on_primary}
                    size={20}
                  />
                </View>
              )}
          </TouchableOpacity>
          {!isPastWorkout && getWorkoutActionButtons()}
        </View>
      </View>
    );
};

export default WorkoutComponent;
