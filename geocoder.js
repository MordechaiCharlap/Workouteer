import Geocoder from "react-native-geocoding";
import { mapsApiKey } from "./utils/mapsApiKey";
export const initGeocoder = () => {
  Geocoder.init(mapsApiKey, { language: "en" });
};
