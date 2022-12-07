import Geocoder from "react-native-geocoding";
export const initGeocoder = () => {
  Geocoder.init("AIzaSyDSprFxxCTG8mwLEfhsun43nSOvzos2-To", { language: "en" });
};
