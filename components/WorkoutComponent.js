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
  const [buttonText, setButtonText] = useState("");
  const [buttonColor, setButtonColor] = useState("white");
  const { user, setUser } = useAuth();
  const [userMemberStatus, setUserMemberStatus] = useState(null);
  const isPastWorkout = props.isPastWorkout;
  const isCreator = props.workout.creator == user.usernameLower;
  const [distance, setDistance] = useState(null);
  const { workoutRequestsAlerts } = useAlerts();
  useEffect(() => {
    // setUserMemberStatus( "invited" );
    // setUserMemberStatus( "not" );
    // setButtonText( "Workout is already full!" );
    // setButtonText("Request to join");
    // setUserMemberStatus( "creator" );
    // setButtonText( "Cancel workout" );
    // setButtonColor( appStyle.color_bg );
    // setUserMemberStatus("member");
    // setButtonText( "Leave workout" );
    // setUserMemberStatus("pending");
    // setButtonText( "Waiting.. Tap to cancel" );
    // setUserMemberStatus("rejected");
    // setButtonText("Request rejected");
    if (props.workout.members[user.usernameLower] == null) {
      if (props.workout.invites[user.usernameLower] == true) {
        setUserMemberStatus("invited");
      }
      setUserMemberStatus("not");
      if (Object.keys(props.workout.members).length >= 10)
        setButtonText("Workout is already full!");
      else setButtonText("Request to join");
    } else {
    }
  }, []);
  useEffect(() => {
    if (props.location) {
      const distance = getDistance(props.location, props.workout.location);
      setDistance(Math.ceil(distance / 1000));
    }
  }, []);
  const leaveWorkout = async () => {
    setButtonText("Left");
    await firebase.leaveWorkout(user, props.workout);
    setUser(await firebase.updateContext(user.usernameLower));
  };
  const cancelWorkout = async () => {
    setButtonText("Canceled");
    await firebase.cancelWorkout(user, props.workout);
    setUser(await firebase.updateContext(user.usernameLower));
  };
  const requestToJoinWorkout = async () => {
    await firebase.requestToJoinWorkout(user.usernameLower, props.workout);
    const membersMapClone = new Map(membersMap);
    membersMapClone.set(user.usernameLower, null);
    setMembersMap(membersMapClone);
  };
  const cancelWorkoutRequest = async () => {
    await firebase.cancelWorkoutRequest(user.usernameLower, props.workout);
    const membersMapClone = new Map(membersMap);
    membersMapClone.delete(user.usernameLower);
    setMembersMap(membersMapClone);
  };
  const workoutActionButtonClicked = async () => {
    switch (userMemberStatus) {
      case "not":
        if (buttonText != "Workout is full!") await requestToJoinWorkout();
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
          {timeString(props.workout.startingTime.toDate())}
        </Text>
        <Text
          className="text-xl rounded-t"
          style={{
            color: appStyle.color_primary,
          }}
        >
          {isCreator ? "Your " : props.workout.creator + "'s "}
          workout
        </Text>
      </View>

      <View className="flex-row flex-1">
        <View className="justify-around items-center aspect-square">
          <FontAwesomeIcon
            icon={workoutTypes[props.workout.type].icon}
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
              {distance
                ? "Less than " + distance + " km away"
                : props.workout.city}
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
              : {props.workout.minutes} minutes
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
              : {Object.keys(props.workout.members).length}
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
              workout: props.workout,
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
        {!isPastWorkout && (
          <TouchableOpacity
            onPress={workoutActionButtonClicked}
            className="mx-1 h-8 rounded w-1 flex-1 justify-center"
            style={{
              backgroundColor: buttonColor,
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
        )}
      </View>
    </View>
  );
};

export default WorkoutComponent;
