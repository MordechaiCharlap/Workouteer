import * as Location from "expo-location";
import { updateUser } from "./firebase";
import Geocoder from "react-native-geocoding";
import { addCountryAndCityToDbIfNeeded } from "./firebase";

export const getCurrentLocation = async (user) => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return false;
  }
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Highest,
    maximumAge: 10000,
  });
  const latLongLocation = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
  if (user && latLongLocation) {
    const userClone = { ...user };
    userClone.lastLocation = latLongLocation;
    const cityAndCountry = await addCountryAndCityToDbIfNeeded(latLongLocation);
    console.log(cityAndCountry);
    userClone.city = cityAndCountry.city;
    userClone.country = cityAndCountry.country;
    await updateUser(userClone);
  }
  return latLongLocation;
};
