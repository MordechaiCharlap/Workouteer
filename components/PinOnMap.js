import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as appStyle from "../utilities/appStyleSheet";
import languageService from "../services/languageService";
const PinOnMap = ({ defaultMarker, saveLocation, backgroundColor }) => {
  const { default: MapView, PROVIDER_GOOGLE } = require("react-native-maps");
  const { Marker } = require("../services/mapsService");
  const [coords, setCoords] = useState(defaultMarker);
  const pressed = (event) => {
    Platform.OS != "web"
      ? setCoords(event.nativeEvent.coordinate)
      : setCoords({
          latitude: event.latLng.lat(),
          longitude: event.latLng.lng(),
        });
    saveLocation(coords);
  };
  return (
    <View className="items-center">
      <View
        className="items-center justify-center p-2 rounded-lg w-full aspect-square"
        style={{
          backgroundColor: backgroundColor
            ? backgroundColor
            : appStyle.color_on_background,
        }}
      >
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          onPress={(e) => pressed(e)}
          initialRegion={{
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={coords} />
        </MapView>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
export default PinOnMap;
