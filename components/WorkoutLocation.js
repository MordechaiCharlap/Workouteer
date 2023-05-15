import { View, Text, TouchableOpacity, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import * as appStyle from "../utilities/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import * as geoService from "../services/geoService";
import languageService from "../services/languageService";
import PinOnMap from "./PinOnMap";
import useAuth from "../hooks/useAuth";
import { mapsApiKey } from "../utilities/mapsApiKey";
import { convertHexToRgba } from "../utilities/stylingFunctions";
const WorkoutLocation = (props) => {
  const { user } = useAuth();
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState(null);
  const [markerCoords, setMarkerCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState(null);
  useEffect(() => {
    const initialShowMap = async () => {
      setIsLoading(true);
      if (user.lastLocation) {
        setMarkerCoords(user.lastLocation);
      } else {
        const latLongLocation = await geoService.getCurrentLocation(user);
        setMarkerCoords(latLongLocation);
      }
      setShowMap(true);
      setIsLoading(false);
    };
    if (props.value) {
      setLocation(props.value);
    } else if (props.initialShow) {
      initialShowMap();
    }
  }, []);
  const setLocationClicked = async () => {
    if (showMap) {
      setShowMap(false);
    } else {
      setIsLoading(true);
      if (!location) {
        const latLongLocation = await geoService.getCurrentLocation();
        if (latLongLocation != null) {
          setMarkerCoords(latLongLocation);
        }
      } else {
        setMarkerCoords(location);
      }
      setShowMap(true);
      setIsLoading(false);
    }
  };
  const getAddress = () => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
        location.latitude
      },${location.longitude}&language=${
        user.language == "hebrew" ? "he" : "en"
      }&key=${mapsApiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        const address = data.results[0].formatted_address;
        setAddress(address);
      })
      .catch((error) => console.error(error));
  };
  const locationPinned = (coords) => {
    setLocation(coords);
    props.locationChanged(coords);
  };
  useEffect(() => {
    if (location) getAddress();
  }, [location]);
  useEffect(() => {
    if (address) {
      props.locationChanged(location);
      setShowMap(false);
    }
  }, [address]);
  return (
    <View>
      <View className="items-center mb-5 gap-x-1">
        {showMap ? (
          <></>
        ) : (
          <View>
            <Text
              className="rounded-t px-2 py-1 text-lg"
              style={{
                color: convertHexToRgba(appStyle.color_primary, 0.9),
                backgroundColor: appStyle.color_on_primary,
              }}
            >
              {address
                ? address
                : languageService[user.language].chooseLocation[
                    user.isMale ? 1 : 0
                  ]}
            </Text>
            <TouchableOpacity
              className="rounded-b justify-center px-2 py-1"
              onPress={setLocationClicked}
              style={{
                backgroundColor:
                  location != null
                    ? appStyle.color_primary
                    : appStyle.color_bg_variant,
              }}
            >
              <Text
                className="text-lg text-center"
                style={{ color: appStyle.color_on_primary }}
              >
                {isLoading
                  ? languageService[props.language].loading
                  : location == null
                  ? languageService[props.language].setLocation
                  : languageService[props.language].clickToChangeLocation}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
          ) : (
            <PinOnMap
              language={props.language}
              defaultMarker={markerCoords}
              saveLocation={locationPinned}
            />
          ))}
      </View>
    </View>
  );
};
export default WorkoutLocation;
