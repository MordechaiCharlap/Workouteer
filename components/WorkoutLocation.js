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
        setLocation(user.lastLocation);
      } else {
        const latLongLocation = await geoService.getCurrentLocation(user);
        setMarkerCoords(latLongLocation);
        setLocation(latLongLocation);
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

  // const getAddress = () => {
  //   fetch(
  //     `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
  //       location.latitude
  //     },${location.longitude}&language=${
  //       user.language == "hebrew" ? "he" : "en"
  //     }&key=${mapsApiKey}`
  //   )
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (
  //         data.results[0].types.includes("gym") ||
  //         data.results[0].types.includes("health")
  //       ) {
  //         fetch(
  //           `https://maps.googleapis.com/maps/api/place/details/json?place_id=${data.results[0].place_id}&key=${mapsApiKey}`
  //         )
  //           .then((response) => response.json())
  //           .then((data) => {
  //             const addressRef = data.result.name;
  //             setAddress(addressRef);
  //           });
  //       } else {
  //         const addressRef = data.results[0].formatted_address;
  //         setAddress(addressRef);
  //       }
  //     })
  //     .catch((error) => console.error(error));
  // };
  const locationPinned = (coords) => {
    if (coords == location) {
      return;
    }
    setLocation(coords);
  };
  useEffect(() => {
    if (location) props.locationChanged(location);
  }, [location]);
  return (
    <View>
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
