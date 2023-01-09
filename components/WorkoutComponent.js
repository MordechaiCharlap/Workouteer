import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import * as appStyle from "../components/AppStyleSheet";
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
const WorkoutComponent = (props) => {
  const navigation = useNavigation();
  const { user, setUser } = useAuth();
  const [workout, setWorkout] = useState(props.workout);
  const [buttonText, setButtonText] = useState("");
  const [userMemberStatus, setUserMemberStatus] = useState(null);
  const isPastWorkout = props.isPastWorkout;
  const isCreator = props.workout.creator == user.usernameLower;
  const [distance, setDistance] = useState(null);
  const { workoutRequestsAlerts } = useAlerts();
  useEffect(() => {
    if (!isPastWorkout && workout) {
      if (isCreator) {
        setUserMemberStatus("creator");
        setButtonText("Cancel workout");
      } else if (workout.members[user.usernameLower] != null) {
        setUserMemberStatus("member");
        setButtonText("Leave workout");
      } else if (workout.invites[user.usernameLower] != null) {
        setUserMemberStatus("invited");
        if (Object.keys(workout.members).length >= 10)
          setButtonText("Workout is full");
        else setButtonText("Accept invite");
      } else if (workout.requests[user.usernameLower] != null) {
        if (workout.requests[user.usernameLower] == true) {
          setUserMemberStatus("pending");
          setButtonText("Cancel request");
        } else {
          setUserMemberStatus("rejected");
          setButtonText("Request rejected");
        }
      } else {
        setUserMemberStatus("not");
        if (Object.keys(workout.members).length >= 10)
          setButtonText("Workout is full");
        else setButtonText("Request to join");
      }
    }
  }, []);
  useEffect(() => {
    if (props.location) {
      const distance = getDistance(props.location, workout.location);
      setDistance(Math.ceil(distance / 1000));
    }
  }, []);
  const leaveWorkout = async () => {
    await firebase.leaveWorkout(user, workout);
    setUser(await firebase.updateContext(user.usernameLower));
  };
  const cancelWorkout = async () => {
    await firebase.cancelWorkout(user, workout);
    setUser(await firebase.updateContext(user.usernameLower));
    setWorkout(null);
  };
  const requestToJoinWorkout = async () => {
    await firebase.requestToJoinWorkout(user.usernameLower, workout);
  };
  const cancelWorkoutRequest = async () => {
    setButtonText("Canceled");
    await firebase.cancelWorkoutRequest(user.usernameLower, workout);
  };
  const acceptWorkoutInvite = async () => {
    await firebase.acceptWorkoutInvite(user.usernameLower, workout);
  };
  const rejectWorkoutInvite = async () => {
    await firebase.rejectWorkoutInvite(user.usernameLower, workout);
  };
  const workoutActionButtonClicked = async () => {
    if (
      buttonText != "Cancled" &&
      buttonText != "Left" &&
      buttonText != "Rejected"
    )
      switch (userMemberStatus) {
        case "invited":
          if (buttonText != "Workout is full") await acceptWorkoutInvite();
        case "not":
          if (buttonText != "Workout is full") await requestToJoinWorkout();
          break;
        case "creator":
          await cancelWorkout();
          break;
        case "member":
          await leaveWorkout();
          break;
        case "pending":
          await cancelWorkoutRequest();
          break;
        case "rejected":
          break;
      }
  };
  const getWorkoutActionButtons = () => {
    return (
      <TouchableOpacity
        onPress={workoutActionButtonClicked}
        className="mx-1 h-8 rounded w-1 flex-1 justify-center"
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
          {buttonText}
        </Text>
      </TouchableOpacity>
    );
  };
  if (workout != null)
    return (
      <View
        className="rounded mb-5"
        style={{
          backgroundColor: appStyle.appLightBlue,
          borderWidth: 2,
          borderColor: appStyle.color_primary,
        }}
      >
        <View
          className="flex-row justify-between px-2"
          style={{
            borderBottomColor: appStyle.color_primary,
            borderBottomWidth: 2,
          }}
        >
          <Text
            className="text-xl rounded-t"
            style={{
              color: appStyle.color_primary,
            }}
          >
            {timeString(workout.startingTime.toDate())}
          </Text>
          <Text
            className="text-xl rounded-t"
            style={{
              color: appStyle.color_primary,
            }}
          >
            {isCreator ? "Your " : workout.creator + "'s "}
            workout
          </Text>
        </View>

        <View className="flex-row flex-1">
          <View className="justify-around items-center aspect-square">
            <FontAwesomeIcon
              icon={workoutTypes[workout.type].icon}
              size={45}
              color={appStyle.color_primary}
            />
          </View>
          <View
            className="p-1 justify-around"
            style={{
              borderLeftColor: appStyle.color_primary,
              borderLeftWidth: 2,
            }}
          >
            <View className="flex-row items-center my-1">
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
                :{" "}
                {distance ? "Less than " + distance + " km away" : workout.city}
              </Text>
            </View>
            <View className="flex-row items-center my-1">
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
                : {workout.minutes} minutes
              </Text>
            </View>
            <View className="flex-row items-center my-1">
              <FontAwesomeIcon
                icon={faUserGroup}
                size={30}
                color={appStyle.color_primary}
              />
              <Text
                className="text-md"
                style={{
                  color: appStyle.color_primary,
                }}
              >
                : {Object.keys(workout.members).length}
              </Text>
            </View>
          </View>
        </View>
        <View
          className="flex-1 py-1 flex-row"
          style={{ borderTopColor: appStyle.color_primary, borderTopWidth: 2 }}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("WorkoutDetails", {
                workout: workout,
                isCreator: isCreator,
                isPastWorkout: isPastWorkout,
                userMemberStatus: userMemberStatus,
              })
            }
            className="mx-1 h-8 w-1 flex-1 rounded justify-center"
            style={{
              backgroundColor: appStyle.color_primary,
            }}
          >
            {!isPastWorkout &&
              isCreator &&
              workoutRequestsAlerts.requestsCount > 0 && (
                <AlertDot number={workoutRequestsAlerts.requestsCount} />
              )}

            <Text
              className="text-center"
              style={{
                color: appStyle.color_on_primary,
              }}
            >
              Details
            </Text>
          </TouchableOpacity>
          {!isPastWorkout && getWorkoutActionButtons()}
        </View>
      </View>
    );
};

export default WorkoutComponent;
