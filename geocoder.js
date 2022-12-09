import Geocoder from "react-native-geocoding";
export const initGeocoder = () => {
  Geocoder.init("AIzaSyB82d0m9dRBff144fQmGIIHQYYOrNdDdWQ", { language: "en" });
};
