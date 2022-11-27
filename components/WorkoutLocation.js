import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import * as appStyle from "./AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import * as Location from "expo-location";
import Map from "./Map";
const WorkoutLocation = (props) => {
  const [showMap, setShowMap] = useState(false);
  const [defaultMarker, setDefaultMarker] = useState(null);
  const [locationType, setLocationType] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const cancelLocation = () => {
    setLocationType(null);
    props.locationChanged(null);
  };
  const setLocationClicked = async () => {
    if (showMap) {
      setShowMap(false);
    } else {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const lotLangLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setDefaultMarker(lotLangLocation);
      setShowMap(true);
    }
  };
  const locationPinned = (coords) => {
    setLocationType("locationPinned");
    setShowMap(false);
    props.locationChanged(coords);
  };
  return (
    <View>
      <View className="flex-row items-center mb-5">
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
          className="rounded justify-center p-1 ml-5"
          onPress={() =>
            locationType == "locationPinned"
              ? cancelLocation()
              : setLocationClicked()
          }
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
      <View className="items-center">
        {showMap && (
          <Map defaultMarker={defaultMarker} saveLocation={locationPinned} />
        )}
      </View>
    </View>
  );
};
export default WorkoutLocation;
