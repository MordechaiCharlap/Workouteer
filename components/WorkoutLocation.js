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
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState(null);
  useEffect(() => {
    if (props.value) {
      setLocation(props.value);
    } else {
      if (user.lastLocation) {
        setLocation(user.lastLocation);
      }
    }
  }, []);
  const getCurrentLocation = async () => {
    setIsLoading(true);
    const latLongLocation = await geoService.getCurrentLocation(user);
    console.log(latLongLocation);
    setLocation(latLongLocation);
  };
  const locationPinned = (coords) => {
    if (coords == location) {
      return;
    }
    setLocation(coords);
  };
  useEffect(() => {
    if (location) {
      props.locationChanged(location);
      setShowMap(true);
    }
    setIsLoading(false);
  }, [location]);
  return (
    <View>
      <View className="items-center">
        {isLoading ? (
          <View
            className="rounded"
            style={{
              borderWidth: 0.5,
              borderColor: appStyle.color_on_primary,
              backgroundColor: appStyle.color_bg_variant,
            }}
          >
            <Text
              className="text-lg p-3"
              style={{ color: appStyle.color_on_primary }}
            >
              {languageService[user.language].gettingCurrentLocation}
            </Text>
          </View>
        ) : showMap ? (
          <PinOnMap
            language={user.language}
            defaultMarker={location}
            saveLocation={locationPinned}
          />
        ) : location != false ? (
          <TouchableOpacity
            onPress={getCurrentLocation}
            className="justify-center items-center px-3 rounded"
            style={{ backgroundColor: appStyle.color_primary, height: 50 }}
          >
            <Text style={{ color: appStyle.color_on_primary }}>
              {
                languageService[user.language].clickForLocation[
                  user.isMale ? 1 : 0
                ]
              }
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            className="justify-center items-center p-3 rounded"
            style={{ backgroundColor: appStyle.color_primary }}
          >
            <Text
              className="text-lg"
              style={{ color: appStyle.color_on_primary }}
            >
              {
                languageService[user.language]
                  .locationPermissionOrInternetProblem
              }
            </Text>
            <TouchableOpacity
              className="px-3 py-1 rounded-full m-2"
              onPress={getCurrentLocation}
              style={{ backgroundColor: appStyle.color_bg }}
            >
              <Text
                className="text-lg"
                style={{ color: appStyle.color_primary }}
              >
                {languageService[user.language].tryAgain[user.isMale ? 1 : 0]}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
