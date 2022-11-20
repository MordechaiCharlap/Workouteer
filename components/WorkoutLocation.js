import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import * as appStyle from "./AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import * as Location from "expo-location";
const WorkoutLocation = (props) => {
  const [locationType, setLocationType] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const cancelLocation = () => {
    setLocationType(null);
  };
  const getPinnedLocation = () => {};
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setLocationType("current");
    props.locationChanged(location);
  };
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <FontAwesomeIcon
          icon={faLocationDot}
          size={25}
          color={appStyle.appGray}
        />
        <Text className="ml-1" style={{ color: appStyle.appGray }}>
          Location:
        </Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          locationType == "current" ? cancelLocation() : getCurrentLocation()
        }
        className="rounded justify-center p-1"
        style={{
          backgroundColor:
            locationType == "current"
              ? appStyle.appNeonAzure
              : appStyle.appLightBlue,
        }}
      >
        <Text style={{ color: appStyle.appDarkBlue }}>Current location</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          locationType == "locationPinned"
            ? cancelLocation()
            : getPinnedLocation()
        }
        className="rounded justify-center p-1"
        style={{
          backgroundColor:
            locationType == "locationPinned"
              ? appStyle.appNeonAzure
              : appStyle.appLightBlue,
        }}
      >
        <Text style={{ color: appStyle.appDarkBlue }}>Set location</Text>
      </TouchableOpacity>
    </View>
  );
};
export default WorkoutLocation;
