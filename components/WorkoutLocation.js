import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import * as appStyle from "./AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import * as Location from "expo-location";
const WorkoutLocation = (props) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    props.locationChanged(location);
    console.log(JSON.stringify(location));
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
      <Text className="ml-1" style={{ color: appStyle.appGray }}>
        {location == null ? "Not chosen" : JSON.stringify(location)}
      </Text>
      <TouchableOpacity
        onPress={getCurrentLocation}
        className="rounded justify-center p-1"
        style={{ backgroundColor: appStyle.appLightBlue }}
      >
        <Text style={{ color: appStyle.appDarkBlue }}>Current location</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="rounded justify-center p-1"
        style={{ backgroundColor: appStyle.appLightBlue }}
      >
        <Text style={{ color: appStyle.appDarkBlue }}>Set location</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutLocation;
