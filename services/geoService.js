import * as Location from "expo-location";
export const getCurrentLocation = async () => {
  const location = await Location.getCurrentPositionAsync({});
  const latLongLocation = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
  return latLongLocation;
};
