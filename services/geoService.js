import * as Location from "expo-location";
import { updateUser } from "./firebase";
import { addCountryAndCityToDbIfNeeded } from "./firebase";
import { GeoPoint, doc, updateDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
function wait(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(false), ms));
}

async function getLocationOrTimeout() {
  const locationPromise = getLocation();
  const timeoutPromise = wait(10000);

  try {
    const location = await Promise.race([locationPromise, timeoutPromise]);
    return location;
  } catch (error) {
    console.log("error");
    console.log(error);
  }
}
const getLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return false;
  } else {
  }
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Highest,
    maximumAge: 10000,
  });
  const latLongLocation = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
  return latLongLocation;
};
export const getCurrentLocation = async (user) => {
  const latLongLocation = await getLocationOrTimeout();
  if (!latLongLocation) return false;
  if (user) {
    const newUpdates = {};
    newUpdates.newLastLocation = new GeoPoint(
      latLongLocation.latitude,
      latLongLocation.longitude
    );
    if (!user.defaultCountry || !user.defaultCity) {
      const cityAndCountry = await addCountryAndCityToDbIfNeeded(
        latLongLocation
      );
      newUpdates.defaultCity = cityAndCountry.city.id;
      newUpdates.defaultCountry = cityAndCountry.country.id;
    }
    const db = getFirestore();
    if (db) {
      updateDoc(doc(db, `users/${user.id}`), newUpdates);
    }
  }
  return latLongLocation;
};
