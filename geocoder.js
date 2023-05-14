import Geocoder from "react-native-geocoding";
import { mapsApiKey } from "./utilities/mapsApiKey";
export const initGeocoder = () => {
  Geocoder.init(mapsApiKey, { language: "en" });
};
