import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
} from "react-native";
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
import useFriendsWorkouts from "../hooks/useFriendsWorkouts";
import usePushNotifications from "../hooks/usePushNotifications";
import { deleteField, doc, updateDoc } from "firebase/firestore";
import languageService from "../services/languageService";
import { useWorkoutLogic } from "../hooks/useWorkoutLogic";
const WorkoutComponent = (props) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { updateArrayIfNeedForWorkout } = useFriendsWorkouts();
  const { workoutRequestsAlerts } = useAlerts();
  const {
    sendPushNotificationUserJoinedYouwWorkout,
    sendPushNotificationUserLeftWorkout,
    schedulePushNotification,
    sendPushNotificationCreatorLeftWorkout,
    cancelScheduledPushNotification,
    sendPushNotificationUserWantsToJoinYourWorkout,
  } = usePushNotifications();
  const { checkIfWorkoutOnPlannedWorkoutTime } = useWorkoutLogic();
  const [workout, setWorkout] = useState(props.workout);
  const [userMemberStatus, setUserMemberStatus] = useState(null);
  const [distance, setDistance] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const isPastWorkout = props.isPastWorkout;
  const isCreator = props.workout.creator == user.id;
  useEffect(() => {
    if (!props.userMemberStatus && !isPastWorkout && workout) {
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
      } else if (
        (workout.sex == "men" && !user.isMale) ||
        (workout.sex == "women" && user.isMale)
      ) {
        setUserMemberStatus("cannot");
      } else {
        setUserMemberStatus("not");
      }
    }
    if (props.userMemberStatus) setUserMemberStatus(props.userMemberStatus);
    if (props.screen != "FutureWorkouts" && user.lastLocation) {
      const distanceCalc = getDistance(user.lastLocation, workout.location);

      const dist = Math.max(Math.ceil(distanceCalc / 1000), 1);
      setDistance(dist);
    }
  }, []);
  const leaveWorkout = async () => {
    const workoutRef = workout;
    if (props.screen == "FutureWorkouts") setWorkout(null);
    else setUserMemberStatus("not");
    await firebase.leaveWorkout(user, workoutRef);
    await cancelScheduledPushNotification(
      workout.members[user.id].notificationId
    );
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
    await cancelScheduledPushNotification(
      workoutRef.members[user.id].notificationId
    );
  };
  const requestToJoinWorkout = async () => {
    if (checkIfWorkoutOnPlannedWorkoutTime(user, workout) != null) return;
    setUserMemberStatus("pending");
    const workoutClone = workout;
    workoutClone.requests[user.id] = true;
    updateArrayIfNeedForWorkout(workoutClone);
    await firebase.requestToJoinWorkout(user.id, workout);
    const creatorData = await firebase.getUserDataById(workout.creator);
    await sendPushNotificationUserWantsToJoinYourWorkout(user, creatorData);
  };
  const cancelWorkoutRequest = async () => {
    setUserMemberStatus("not");
    const workoutClone = workout;
    delete workoutClone.requests[user.id];
    updateArrayIfNeedForWorkout(workoutClone);
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
    const workoutClone = workout;
    workoutClone.invites[user.id] = false;
    updateArrayIfNeedForWorkout(workoutClone);
    await firebase.rejectWorkoutInvite(user.id, workoutRef);
  };
  const getWorkoutActionButtons = () => {
    switch (userMemberStatus) {
      case "invited":
        return (
          <View className={`gap-x-0.5 flex-row`}>
            <TouchableOpacity
              onPress={acceptWorkoutInvite}
              className="h-8 flex-1 justify-center rounded-bl-lg"
              style={style.actionButton}
            >
              <Text
                className="text-center font-semibold"
                style={style.actionButtonText}
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
              className="h-8 flex-1 justify-center rounded-br-lg"
              style={style.actionButton}
            >
              <Text
                className="text-center font-semibold"
                style={style.actionButtonText}
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
            className={`h-8 flex-1 justify-center ${
              userMemberStatus == "invited" ? "" : "rounded-br-lg"
            }`}
            style={style.actionButton}
          >
            <Text className="text-center" style={style.actionButtonText}>
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
            className={`h-8 flex-1 justify-center ${
              userMemberStatus == "invited" ? "" : "rounded-br-lg"
            }`}
            style={style.actionButton}
          >
            <Text className="text-center" style={style.actionButtonText}>
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
            className={`h-8 flex-1 justify-center ${
              userMemberStatus == "invited" ? "" : "rounded-br-lg"
            }`}
            style={style.actionButton}
          >
            <Text className="text-center" style={style.actionButtonText}>
              {buttonLoading
                ? languageService[user.language].loading
                : languageService[user.language].cancelRequest[
                    user.isMale ? 1 : 0
                  ]}
            </Text>
          </TouchableOpacity>
        );
      case "not":
        return (
          <TouchableOpacity
            onPress={requestToJoinWorkout}
            className={`h-8 flex-1 justify-center ${
              userMemberStatus == "invited" ? "" : "rounded-br-lg"
            }`}
            style={style.actionButton}
          >
            <Text className="text-center" style={style.actionButtonText}>
              {buttonLoading
                ? languageService[user.language].loading
                : languageService[user.language].requestToJoin[
                    user.isMale ? 1 : 0
                  ]}
            </Text>
          </TouchableOpacity>
        );
      case "cannot":
        return (
          <View
            className={`h-8 flex-1 justify-center ${
              userMemberStatus == "invited" ? "" : "rounded-br-lg"
            }`}
            style={style.actionButton}
          >
            <Text className="text-center" style={style.actionButtonText}>
              {user.isMale
                ? languageService[user.language].womenOnly
                : languageService[user.language].maleOnly}
            </Text>
          </View>
        );
      default:
        return <></>;
    }
  };
  if (workout != null)
    return (
      <View style={style.container}>
        <View
          className={`items-center justify-between py-1 px-2 flex-row${
            user.language == "hebrew" ? "-reverse" : ""
          }`}
          style={style.topSection}
        >
          <Text
            className={Platform.OS != "web" ? "text-xl" : ""}
            style={style.creatorText}
          >
            {isCreator
              ? languageService[user.language].yourWorkout
              : user.language == "hebrew"
              ? `האימון של ${workout.creator}`
              : workout.creator + "`s" + " workout"}
          </Text>
          <Text
            className={Platform.OS != "web" ? "text-xl" : ""}
            style={style.dateText}
          >
            {timeString(workout.startingTime.toDate(), user.language)}
          </Text>
        </View>

        <View
          className={`h-28 flex-row${
            user.language == "hebrew" ? "-reverse" : ""
          }`}
          style={style.middleSection}
        >
          <View className="justify-around flex-1">
            <View
              className={`items-center my-1 gap-x-1 flex-row${
                user.language == "hebrew" ? "-reverse" : ""
              }`}
            >
              <FontAwesomeIcon
                icon={faLocationDot}
                size={style.detailsIcons.size}
                color={style.detailsIcons.color}
              />
              <Text className="text-md" style={style.basicDetailsText}>
                {distance != null
                  ? distance == 1
                    ? languageService[user.language].kmAway
                    : distance + " " + languageService[user.language].kmsAway
                  : workout.city[user.language]
                  ? workout.city[user.language]
                  : workout.city["english"]}
              </Text>
            </View>
            <View
              className={`items-center my-1 gap-x-1 flex-row${
                user.language == "hebrew" ? "-reverse" : ""
              }`}
            >
              <FontAwesomeIcon
                icon={faStopwatch}
                size={style.detailsIcons.size}
                color={style.detailsIcons.color}
              />
              <Text className="text-md" style={style.basicDetailsText}>
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
                size={style.detailsIcons.size}
                color={style.detailsIcons.color}
              />
              <Text style={style.basicDetailsText}>
                {Object.keys(workout.members).length}
              </Text>
            </View>
          </View>
          <View className="justify-center items-center aspect-square">
            <FontAwesomeIcon
              icon={workoutTypes[workout.type].icon}
              size={45}
              color={style.workoutIcon.color}
            />
          </View>
        </View>
        <View
          className="flex-1"
          style={{
            flexDirection: userMemberStatus == "invited" ? "column" : "row",
            columnGap: userMemberStatus == "invited" ? 0 : 3,
          }}
        >
          <TouchableOpacity
            className={`h-8 flex-1 justify-center flex-row items-center ${
              userMemberStatus == "invited"
                ? ""
                : !isPastWorkout
                ? "rounded-bl-lg"
                : "rounded-b-lg"
            }`}
            onPress={() =>
              navigation.navigate("WorkoutDetails", {
                workout: workout,
                isCreator: isCreator,
                isPastWorkout: isPastWorkout,
                userMemberStatus: userMemberStatus,
              })
            }
            style={style.actionButton}
          >
            <Text style={style.actionButtonText}>
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
          {!isPastWorkout &&
            userMemberStatus != "invited" &&
            getWorkoutActionButtons()}
        </View>
        {!isPastWorkout && userMemberStatus == "invited" && (
          <View>{getWorkoutActionButtons()}</View>
        )}
      </View>
    );
};
const topSectionFontSize = 16;
const style = StyleSheet.create({
  container: { marginBottom: 15, rowGap: 3 },
  topSection: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: appStyle.color_primary,
  },
  middleSection: {
    paddingHorizontal: 7,
    backgroundColor: appStyle.color_primary,
  },
  BottomSection: {},
  workoutIcon: { color: appStyle.color_on_primary },
  dividers: {
    width: 2,
    color: appStyle.color_background,
  },
  creatorText: {
    color: appStyle.color_on_primary,
    fontSize: topSectionFontSize,
  },
  dateText: { color: appStyle.color_on_primary, fontSize: topSectionFontSize },
  basicDetailsText: {
    color: appStyle.color_on_primary,
  },
  detailsIcons: {
    size: 20,
    color: appStyle.color_on_primary,
  },
  actionButton: {
    backgroundColor: appStyle.color_primary,
  },
  actionButtonText: {
    color: appStyle.color_on_primary,
  },
});
export default WorkoutComponent;
