import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as appStyle from "../utilities/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faLocationDot,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";
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
      const currentChosenLoc = location;
      if (!currentChosenLoc) {
        const latLongLocation = await geoService.getCurrentLocation();
        if (latLongLocation != null) {
          setMarkerCoords(latLongLocation);
        }
      } else {
        setMarkerCoords(currentChosenLoc);
      }
      // setLocation();
      // setAddress();
      // props.locationChanged()
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
        if (
          data.results[0].types.includes("gym") ||
          data.results[0].types.includes("health")
        ) {
          fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${data.results[0].place_id}&key=${mapsApiKey}`
          )
            .then((response) => response.json())
            .then((data) => {
              const addressRef = data.result.name;
              setAddress(addressRef);
            });
        } else {
          const addressRef = data.results[0].formatted_address;
          setAddress(addressRef);
        }
      })
      .catch((error) => console.error(error));
  };
  const locationPinned = (coords) => {
    if (coords == location) {
      setShowMap(false);
      return;
    }
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
          <View className="flex-row items-center w-full">
            <TouchableOpacity
              className="rounded-l-full justify-center items-center px-4"
              onPress={setLocationClicked}
              style={[
                {
                  backgroundColor:
                    location != null
                      ? appStyle.color_primary
                      : appStyle.color_bg_variant,
                },
                style.genericWorkoutProp,
              ]}
            >
              <FontAwesomeIcon
                icon={faMapLocationDot}
                color={appStyle.color_on_primary}
                size={30}
              />
              {/* <Text
                className="text-lg text-center"
                style={{ color: appStyle.color_on_primary }}
              >
                {isLoading
                  ? languageService[props.language].loading
                  : location == null
                  ? languageService[props.language].setLocation
                  : languageService[props.language].clickToChangeLocation}
              </Text> */}
            </TouchableOpacity>
            <View
              className="justify-center rounded-r-full flex-1 px-2"
              style={[
                style.genericWorkoutProp,
                { backgroundColor: appStyle.color_on_primary },
              ]}
            >
              <Text
                className="px-2 py-1 text-lg"
                style={{
                  color: convertHexToRgba(appStyle.color_primary, 0.9),
                }}
              >
                {address
                  ? address
                  : languageService[user.language].chooseLocation[
                      user.isMale ? 1 : 0
                    ]}
              </Text>
            </View>
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
const style = StyleSheet.create({
  genericWorkoutProp: {
    height: 50,
  },
});
export default WorkoutLocation;
