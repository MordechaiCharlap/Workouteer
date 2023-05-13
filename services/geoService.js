import * as Location from "expo-location";
import { updateUser } from "./firebase";
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
    if (!userClone.defaultCountry || !userClone.defaultCity) {
      const cityAndCountry = await addCountryAndCityToDbIfNeeded(
        latLongLocation
      );
      userClone.defaultCity = cityAndCountry.city.id;
      userClone.defaultCountry = cityAndCountry.country.id;
    }

    await updateUser(userClone);
  }
  return latLongLocation;
};
