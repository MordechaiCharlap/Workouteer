import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import * as appStyle from "./AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import * as geoService from "../services/geoService";
import PinOnMap from "./PinOnMap";
const WorkoutLocation = (props) => {
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState(null);
  const [markerCoords, setMarkerCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const cancelLocation = () => {
    setLocation(null);
    props.locationChanged(null);
  };
  const setLocationClicked = async () => {
    if (showMap) {
      setShowMap(false);
    } else {
      setShowMap(true);
      setIsLoading(true);
      const latLongLocation = await geoService.getCurrentLocation();
      setMarkerCoords(latLongLocation);
      setIsLoading(false);
    }
  };
  const locationPinned = (coords) => {
    setLocation(coords);
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
            color={appStyle.color_primary}
          />
          <Text className="ml-1" style={{ color: appStyle.color_primary }}>
            Location:
          </Text>
        </View>
        <TouchableOpacity
          className="rounded justify-center p-1 ml-5"
          onPress={location != null ? cancelLocation : setLocationClicked}
          style={{
            backgroundColor:
              location != null
                ? appStyle.color_primary_variant
                : appStyle.color_primary,
          }}
        >
          <Text style={{ color: appStyle.color_on_primary }}>
            {location == null ? "Set location" : "Click to change location"}
          </Text>
        </TouchableOpacity>
      </View>
      <View className="items-center">
        {showMap &&
          (isLoading ? (
            <Text
              className="text-lg ml-3 p-3"
              style={{ backgroundColor: appStyle.color_secondary }}
            >
              Getting your location...
            </Text>
          ) : (
            <PinOnMap
              defaultMarker={markerCoords}
              saveLocation={locationPinned}
            />
          ))}
      </View>
    </View>
  );
};
export default WorkoutLocation;
