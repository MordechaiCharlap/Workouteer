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
    props.saveLocation(coords);
  };
  return (
    <View className="items-center">
      <View
        className="items-center justify-center p-2 rounded-lg w-full aspect-square"
        style={{
          backgroundColor: appStyle.color_primary,
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

      {/* <TouchableOpacity
        className="absolute bottom-4 px-3 py-2"
        style={{
          backgroundColor: appStyle.color_primary,
          borderColor: appStyle.color_bg,
          borderWidth: 2,
        }}
        onPress={() => saveLocation()}
      >
        <Text
          className="text-xl font-semibold"
          style={{ color: appStyle.color_on_primary }}
        >
          {languageService[props.language].saveLocation}
        </Text>
      </TouchableOpacity> */}
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
