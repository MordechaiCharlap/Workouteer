import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as appStyle from "../utils/appStyleSheet";
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
import { timeString } from "../utils/timeFunctions";
import AlertDot from "../components/AlertDot";
import useAuth from "../hooks/useAuth";
import useAlerts from "../hooks/useAlerts";
import useFriendsWorkouts from "../hooks/useFriendsWorkouts";
import usePushNotifications from "../hooks/usePushNotifications";
import { deleteField, doc, updateDoc } from "firebase/firestore";
import languageService from "../services/languageService";
import { useWorkoutLogic } from "../hooks/useWorkoutLogic";
import CustomButton from "../components/basic/CustomButton";
import useFirebase from "../hooks/useFirebase";
import appComponentsDefaultStyles from "../utils/appComponentsDefaultStyles";
import useCurrentWorkout from "../hooks/useCurrentWorkout";
const WorkoutComponent = (props) => {
  const navigation = useNavigation();
  const { db } = useFirebase();
  const { currentWorkout } = useCurrentWorkout();
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
    if (
      props.screen != "FutureWorkouts" &&
      !isPastWorkout &&
      user.lastLocation
    ) {
      const distanceCalc = getDistance(
        {
          latitude: user.lastLocation.latitude,
          longitude: user.lastLocation.longitude,
        },
        {
          latitude: workout.location.latitude,
          longitude: workout.location.longitude,
        }
      );
      const dist = Math.max(Math.ceil(distanceCalc / 1000), 1);
      setDistance(dist);
    }
  }, []);
  const leaveWorkout = () => {
    const workoutRef = workout;
    if (props.screen == "FutureWorkouts") setWorkout(null);
    else setUserMemberStatus("not");
    firebase.leaveWorkout(user, workoutRef);
    cancelScheduledPushNotification(workout.members[user.id].notificationId);
    sendPushNotificationUserLeftWorkout(workoutRef, user.id, user.displayName);
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
  const cancelWorkout = () => {
    var workoutRef = workout;
    setWorkout(null);
    updateDoc(doc(db, "users", user.id), {
      [`plannedWorkouts.${workout.id}`]: deleteField(),
    });
    if (Object.entries(workoutRef.members).length > 1) {
      for (var member of Object.keys(workoutRef.members)) {
        if (member != user.id) {
          workoutRef.creator = member;
          break;
        }
      }
      sendPushNotificationCreatorLeftWorkout(
        workoutRef,
        user.id,
        user.displayName
      );
      updateDoc(doc(db, `workouts/${workoutRef.id}`), {
        creator: workoutRef.creator,
        [`members.${user.id}`]: deleteField(),
      });
    } else {
      firebase.cancelWorkout(workoutRef);
    }
    cancelScheduledPushNotification(workoutRef.members[user.id].notificationId);
  };
  const requestToJoinWorkout = () => {
    if (checkIfWorkoutOnPlannedWorkoutTime(user, workout) != null) return;
    setUserMemberStatus("pending");
    const workoutClone = JSON.parse(JSON.stringify(workout));
    workoutClone.requests[user.id] = true;
    updateArrayIfNeedForWorkout(workoutClone);
    firebase.requestToJoinWorkout(user.id, workout);
    firebase
      .getUserDataById(workout.creator)
      .then((creatorData) =>
        sendPushNotificationUserWantsToJoinYourWorkout(
          user,
          creatorData,
          workout
        )
      );
  };
  const cancelWorkoutRequest = () => {
    setUserMemberStatus("not");
    const workoutClone = JSON.parse(JSON.stringify(workout));
    delete workoutClone.requests[user.id];
    updateArrayIfNeedForWorkout(workoutClone);
    firebase.cancelWorkoutRequest(user.id, workout);
  };
  const acceptWorkoutInvite = () => {
    const workoutRef = workout;
    if (props.screen == "WorkoutInvites") setWorkout(null);
    setUserMemberStatus("member");
    if (Platform.OS != "web") {
      schedulePushNotification(
        workoutRef.startingTime.toDate(),
        "Workouteer",
        languageService[user.language].confirmYourWorkout[user.isMale ? 1 : 0],
        { type: "workoutDetails", workoutId: workout.id }
      ).then((scheduledNotificationId) => {
        firebase.acceptWorkoutInvite(user, workoutRef, scheduledNotificationId);
      });
    } else firebase.acceptWorkoutInvite(user, workoutRef, null);
    sendPushNotificationUserJoinedYouwWorkout(workoutRef, user, user.id);
  };
  const rejectWorkoutInvite = () => {
    setUserMemberStatus("not");
    const workoutRef = JSON.parse(JSON.stringify(workout));
    if (props.screen == "WorkoutInvites") setWorkout(null);
    else {
      const workoutClone = JSON.parse(JSON.stringify(workout));
      workoutClone.invites[user.id] = false;
      updateArrayIfNeedForWorkout(workoutClone);
    }

    firebase.rejectWorkoutInvite(user.id, workoutRef);
  };

  const containerColor = props.containerColor || appStyle.color_surface;
  const onContainerColor = props.onContainerColor || appStyle.color_on_surface;

  const topSectionFontSize = 16;
  const style = StyleSheet.create({
    container: {
      borderRadius: 8,
      padding: 5,
      marginBottom: 15,
      rowGap: 3,
      backgroundColor: containerColor,
      borderColor: appStyle.color_outline,
      borderWidth: 1,
      marginHorizontal: 16,
    },
    topSection: {},
    middleSection: {
      paddingHorizontal: 7,
    },
    BottomSection: {},
    workoutIcon: { color: onContainerColor },
    dividers: {
      width: 2,
      color: appStyle.color_background,
    },
    creatorText: {
      color: onContainerColor,
      fontSize: topSectionFontSize,
    },
    dateText: {
      color: onContainerColor,
      fontSize: topSectionFontSize,
    },
    basicDetailsText: {
      color: onContainerColor,
    },
    detailsIcons: {
      size: 20,
      color: onContainerColor,
    },
    actionButton: {
      flex: 1,
      backgroundColor: appStyle.color_on_background,
    },
    actionButtonText: {
      color: containerColor,
    },
  });
  const getWorkoutActionButtons = () => {
    switch (userMemberStatus) {
      case "invited":
        return (
          <View className={`gap-x-0.5 flex-row`}>
            <CustomButton
              onPress={acceptWorkoutInvite}
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
            </CustomButton>
            <CustomButton
              onPress={rejectWorkoutInvite}
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
            </CustomButton>
          </View>
        );
      case "creator":
        return (
          <CustomButton onPress={cancelWorkout} style={style.actionButton}>
            <Text className="text-center" style={style.actionButtonText}>
              {buttonLoading
                ? languageService[user.language].loading
                : Object.entries(workout.members).length > 1
                ? languageService[user.language].leave[user.isMale ? 1 : 0]
                : languageService[user.language].cancelWorkout}
            </Text>
          </CustomButton>
        );
      case "member":
        return (
          <CustomButton onPress={leaveWorkout} style={style.actionButton}>
            <Text className="text-center" style={style.actionButtonText}>
              {buttonLoading
                ? languageService[user.language].loading
                : languageService[user.language].leave[user.isMale ? 1 : 0]}
            </Text>
          </CustomButton>
        );
      case "pending":
        return (
          <CustomButton
            onPress={cancelWorkoutRequest}
            style={style.actionButton}
          >
            <Text className="text-center" style={style.actionButtonText}>
              {buttonLoading
                ? languageService[user.language].loading
                : languageService[user.language].cancelRequest[
                    user.isMale ? 1 : 0
                  ]}
            </Text>
          </CustomButton>
        );
      case "not":
        return (
          <CustomButton
            onPress={requestToJoinWorkout}
            style={style.actionButton}
          >
            <Text className="text-center" style={style.actionButtonText}>
              {buttonLoading
                ? languageService[user.language].loading
                : languageService[user.language].requestToJoin[
                    user.isMale ? 1 : 0
                  ]}
            </Text>
          </CustomButton>
        );
      case "cannot":
        return (
          <View
            className={`h-8 flex-1 justify-center ${
              userMemberStatus == "invited" ? "" : ""
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
      <View style={[style.container, appComponentsDefaultStyles.shadow]}>
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
          <CustomButton
            onPress={() =>
              navigation.navigate("WorkoutDetails", {
                workout: workout,
                isCreator: isCreator,
                isPastWorkout: isPastWorkout,
                userMemberStatus: userMemberStatus,
              })
            }
            style={{ ...style.actionButton, flexDirection: "row" }}
          >
            <Text style={style.actionButtonText}>
              {languageService[user.language].details}
            </Text>
            {!isPastWorkout &&
              isCreator &&
              workoutRequestsAlerts[workout.id] &&
              workoutRequestsAlerts[workout.id].requestsCount > 0 && (
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: 5 }} />
                  <AlertDot
                    text={workoutRequestsAlerts[workout.id].requestsCount}
                    textColor={appStyle.color_on_background}
                    color={appStyle.color_on_primary}
                    size={20}
                  />
                </View>
              )}
          </CustomButton>
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

export default WorkoutComponent;
