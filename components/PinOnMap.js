import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as appStyle from "../utilites/appStyleSheet";
import languageService from "../services/languageService";
const PinOnMap = (props) => {
  const { default: MapView, PROVIDER_GOOGLE } = require("react-native-maps");
  const { Marker } = require("../services/mapsService");
  const [coords, setCoords] = useState(props.defaultMarker);
  const pressed = (event) => {
    Platform.OS != "web"
      ? setCoords(event.nativeEvent.coordinate)
      : setCoords({
          latitude: event.latLng.lat(),
          longitude: event.latLng.lng(),
        });
  };
  const saveLocation = () => {
    props.saveLocation(coords);
  };
  return (
    <View className="items-center">
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
      <TouchableOpacity
        className="absolute bottom-4 rounded p-2"
        style={{
          backgroundColor: appStyle.color_bg,
          borderColor: appStyle.color_primary,
          borderWidth: 1,
        }}
        onPress={() => saveLocation()}
      >
        <Text
          className="text-1xl font-semibold"
          style={{ color: appStyle.color_primary }}
        >
          {languageService[props.language].saveLocation}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  map: {
    height: 400,
    width: 400,
  },
});
export default PinOnMap;
