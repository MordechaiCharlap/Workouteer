import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import { workoutTypes } from "../components/WorkoutType";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faLocationDot,
  faStopwatch,
  faUserGroup,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { getDistance } from "geolib";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { timeString } from "../services/timeFunctions";
import { useEffect } from "react";
const WorkoutComponent = (props) => {
  const navigation = useNavigation();
  const [buttonText, setButtonText] = useState("");
  const [buttonColor, setButtonColor] = useState("white");
  const { user, setUser } = useAuth();
  const [membersMap, setMembersMap] = useState(
    new Map(Object.entries(props.workout.members))
  );
  const [members, setMembers] = useState(null);
  const [userMemberStatus, setUserMemberStatus] = useState(null);
  const isPastWorkout = props.isPastWorkout;
  const isCreator = props.workout.creator == user.usernameLower;
  const [distance, setDistance] = useState(null);
  const [requests, setRequests] = useState(0);
  useEffect(() => {
    if (!membersMap.has(user.usernameLower)) {
      setUserMemberStatus("not");
    } else {
      switch (membersMap.get(user.usernameLower)) {
        case true:
          if (isCreator) {
            setUserMemberStatus("creator");
            setButtonText("Cancel workout");
            setButtonColor(appStyle.appRed);
          } else {
            setUserMemberStatus("member");
            setButtonText("Leave workout");
          }
          break;
        case null:
          setUserMemberStatus("pending");
          setButtonText("Waiting.. Tap to cancel");
          break;
        case false:
          setUserMemberStatus("rejected");
          setButtonText("Request rejected");
          break;
      }
    }
    var membersCount = 0;
    var requestsCount = 0;
    for (var value of membersMap.values()) {
      if (value == true) membersCount++;
      else if (value == null) requests++;
    }
    setRequests(requestsCount);
    setMembers(membersCount);

    if (userMemberStatus == "not") {
      if (membersCount == 10) setButtonText("Workout is full!");
      else if (requestsCount == 10) setButtonText("Requests are full");
      else setButtonText("Request to join");
    }
  }, [membersMap]);
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
    console.log("requesting to join");
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
        if (
          buttonText != "Workout is full!" ||
          buttonText != "Requests are full"
        )
          await requestToJoinWorkout();
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
      }}
    >
      <View
        className="flex-row justify-between px-2"
        style={{
          borderBottomColor: appStyle.appDarkBlue,
          borderBottomWidth: 2,
        }}
      >
        <Text
          className="text-xl rounded-t"
          style={{
            color: appStyle.appDarkBlue,
          }}
        >
          {timeString(props.workout.startingTime.toDate())}
        </Text>
        <Text
          className="text-xl rounded-t"
          style={{
            color: appStyle.appDarkBlue,
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
            color={appStyle.appDarkBlue}
          />
        </View>
        <View
          className="p-1 justify-around"
          style={{
            borderLeftColor: appStyle.appDarkBlue,
            borderLeftWidth: 2,
          }}
        >
          <View className="flex-row items-center my-1">
            <FontAwesomeIcon
              icon={faLocationDot}
              size={30}
              color={appStyle.appDarkBlue}
            />
            <Text
              className="text-md"
              style={{
                color: appStyle.appDarkBlue,
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
              color={appStyle.appDarkBlue}
            />
            <Text
              className="text-md"
              style={{
                color: appStyle.appDarkBlue,
              }}
            >
              : {props.workout.minutes} minutes
            </Text>
          </View>
          <View className="flex-row items-center my-1">
            <FontAwesomeIcon
              icon={faUserGroup}
              size={30}
              color={appStyle.appDarkBlue}
            />
            <Text
              className="text-md"
              style={{
                color: appStyle.appDarkBlue,
              }}
            >
              : {members}
            </Text>
          </View>
        </View>
      </View>
      <View
        className="flex-1 py-1 flex-row"
        style={{ borderTopColor: appStyle.appDarkBlue, borderTopWidth: 2 }}
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
            backgroundColor: appStyle.appDarkBlue,
          }}
        >
          {!isPastWorkout && isCreator && requests > 0 && (
            <View
              className="absolute aspect-square left-5 w-5 h-5 items-center justify-center rounded-full"
              style={{
                borderWidth: 1,
                borderColor: appStyle.appAzure,
                backgroundColor: appStyle.appLightBlue,
              }}
            >
              <Text
                className="font-semibold"
                style={{
                  color: appStyle.appDarkBlue,
                }}
              >
                {notificationCount}
              </Text>
            </View>
          )}

          <Text
            className="text-center"
            style={{
              color: appStyle.appGray,
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
              borderColor: appStyle.appDarkBlue,
              borderWidth: 1,
            }}
          >
            <Text
              className="text-center"
              style={{
                color: appStyle.appDarkBlue,
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
