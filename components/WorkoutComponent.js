import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import { workoutTypes } from "../components/WorkoutType";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStopwatch, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { timeString } from "../services/timeFunctions";
import { useEffect } from "react";
const WorkoutComponent = (props) => {
  const navigation = useNavigation();
  const [buttonText, setButtonText] = useState("");
  const { user, setUser } = useAuth();
  const membersMap = new Map(Object.entries(props.workout.members));
  const [userMemberStatus, setUserMemberStatus] = useState(null);
  const isPastWorkout = props.isPastWorkout;
  const isCreator = props.workout.creator == user.usernameLower;
  useEffect(() => {
    if (!membersMap.has(user.usernameLower)) {
      setUserMemberStatus("not");
      setButtonText("Request to join");
    } else {
      switch (membersMap.get(user.usernameLower)) {
        case true:
          if (isCreator) {
            setUserMemberStatus("creator");
            setButtonText("Cancel workout");
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
  }, [membersMap]);
  const leaveWorkout = async (workout) => {
    setButtonText("Left");
    await firebase.leaveWorkout(user, workout);
    setUser(await firebase.updateContext(user.usernameLower));
  };
  const cancelWorkout = async (workout) => {
    setButtonText("Canceled");
    await firebase.cancelWorkout(user, workout);
    setUser(await firebase.updateContext(user.usernameLower));
  };
  const requestToJoin = async (workout) => {
    await firebase.requestToJoinWorkout(user.usernameLower, workout);
  };
  const cancelRequest = async (workout) => {};
  return (
    <View
      className="rounded h-32 mb-5"
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
          {isCreator ? "Your " : props.workout.creator + "'s"}
          workout
        </Text>
      </View>

      <View className="flex-row flex-1">
        <View
          className="justify-around items-center aspect-square"
          style={{
            borderRightColor: appStyle.appDarkBlue,
            borderRightWidth: 2,
          }}
        >
          <FontAwesomeIcon
            icon={workoutTypes[props.workout.type].icon}
            size={60}
            color={appStyle.appDarkBlue}
          />
        </View>
        <View className="px-2 justify-evenly">
          <View className="flex-row items-center">
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
          <View className="flex-row items-center">
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
              : {new Map(Object.entries(props.workout.members)).size}
            </Text>
          </View>
        </View>
        <View className="justify-around flex-1">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("WorkoutDetails", {
                workout: props.workout,
                isCreator: isCreator,
                isPastWorkout: isPastWorkout,
              })
            }
            className="mx-2 h-8 justify-center rounded"
            style={{
              backgroundColor: appStyle.appDarkBlue,
            }}
          >
            <Text
              className="text-center"
              style={{
                color: appStyle.appGray,
              }}
            >
              More details
            </Text>
          </TouchableOpacity>
          {!isPastWorkout && (
            <TouchableOpacity
              onPress={() =>
                buttonText
                  ? {}
                  : isCreator
                  ? cancelWorkout(props.workout)
                  : leaveWorkout(props.workout)
              }
              className="mx-2 h-8 justify-center rounded"
              style={{
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
    </View>
  );
};

export default WorkoutComponent;
