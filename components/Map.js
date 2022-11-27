import { faDotCircle, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as appStyle from "./AppStyleSheet";
const Map = (props) => {
  const [coords, setCoords] = useState(props.defaultMarker);
  const pressed = (ltLng) => {
    console.log(ltLng);
    setCoords(ltLng);
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
        onPress={(e) => pressed(e.nativeEvent.coordinate)}
        initialRegion={{
          latitude: props.defaultMarker.latitude,
          longitude: props.defaultMarker.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={coords} />
      </MapView>
      <TouchableOpacity
        className="absolute bottom-4 rounded p-2"
        style={{
          backgroundColor: appStyle.appLightBlue,
          borderColor: appStyle.appDarkBlue,
          borderWidth: 1,
        }}
        onPress={() => saveLocation()}
      >
        <Text
          className="text-1xl font-semibold"
          style={{ color: appStyle.appDarkBlue }}
        >
          Save location
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
export default Map;
