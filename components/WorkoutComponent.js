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
  const [userMemberStatus, setUserMemberStatus] = useState(null);
  const isPastWorkout = props.isPastWorkout;
  const isCreator = props.workout.creator == user.usernameLower;
  const [distance, setDistance] = useState(null);
  const { workoutRequestsAlerts } = useAlerts();
  useEffect(() => {
    if (!isPastWorkout && workout) {
      if (isCreator) {
        setUserMemberStatus("creator");
      } else if (workout.members[user.usernameLower] != null) {
        setUserMemberStatus("member");
      } else if (workout.invites[user.usernameLower] != null) {
        setUserMemberStatus("invited");
      } else if (workout.requests[user.usernameLower] != null) {
        if (workout.requests[user.usernameLower] == true) {
          setUserMemberStatus("pending");
        } else {
          setUserMemberStatus("rejected");
          setWorkout(null);
        }
      } else {
        setUserMemberStatus("not");
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
    if (props.screen == "FutureWorkouts") setWorkout(null);
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
    setUser(await firebase.updateContext(user.usernameLower));
    if (props.screen == "WorkoutInvites") setWorkout(null);
  };
  const rejectWorkoutInvite = async () => {
    await firebase.rejectWorkoutInvite(user.usernameLower, workout);
    if (props.screen == "WorkoutInvites") setWorkout(null);
  };
  const getWorkoutActionButtons = () => {
    switch (userMemberStatus) {
      case "invited":
        return (
          <View className="flex-row mt-1">
            <TouchableOpacity
              onPress={acceptWorkoutInvite}
              className="mx-1 h-8 rounded flex-1 justify-center"
              style={{
                backgroundColor: appStyle.color_success,
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
                Accept invite
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={rejectWorkoutInvite}
              className="mx-1 h-8 rounded flex-1 justify-center"
              style={{
                backgroundColor: appStyle.color_error,
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
                Reject invite
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
              Cancel Workout
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
              Leave Workout
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
              Cancel Workout Request
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
              Request to join
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
          className="flex-1 py-1"
          style={{
            borderTopColor: appStyle.color_primary,
            borderTopWidth: 2,
            flexDirection: userMemberStatus == "invited" ? "column" : "row",
          }}
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
            className="mx-1 h-8 flex-1 rounded justify-center"
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
