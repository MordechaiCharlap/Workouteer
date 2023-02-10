import { View, Text, TouchableOpacity, Platform } from "react-native";
import React, { useState } from "react";
import * as appStyle from "./AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import * as geoService from "../services/geoService";
import PinOnMap from "./PinOnMap";
import languageService from "../services/languageService";
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
      if (latLongLocation != null) setMarkerCoords(latLongLocation);
      else setShowMap(false);
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
      <View
        className={`items-center mb-5 gap-x-1 ${
          props.language == "hebrew" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <View
          className={`items-center gap-x-1 ${
            props.language == "hebrew" ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <FontAwesomeIcon
            icon={faLocationDot}
            size={25}
            color={appStyle.color_primary}
          />
          <Text style={{ color: appStyle.color_primary }}>
            {languageService[props.language].location}:
          </Text>
        </View>
        <TouchableOpacity
          className="rounded justify-center p-1"
          onPress={location != null ? cancelLocation : setLocationClicked}
          style={{
            backgroundColor:
              location != null
                ? appStyle.color_primary_variant
                : appStyle.color_primary,
          }}
        >
          <Text style={{ color: appStyle.color_on_primary }}>
            {location == null
              ? languageService[props.language].setLocation
              : languageService[props.language].clickToChangeLocation}
          </Text>
        </TouchableOpacity>
      </View>
      <View className="items-center">
        {showMap &&
          (isLoading ? (
            <Text
              className="text-lg p-3"
              style={{ backgroundColor: appStyle.color_secondary }}
            >
              {languageService[props.language].gettingCurrentLocation}
            </Text>
          ) : Platform.OS != "web" ? (
            <PinOnMap
              defaultMarker={markerCoords}
              saveLocation={locationPinned}
            />
          ) : (
            <Text>{languageService[props.language].webMapsError}</Text>
          ))}
      </View>
    </View>
  );
};
export default WorkoutLocation;
