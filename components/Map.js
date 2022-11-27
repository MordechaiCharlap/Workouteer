import React from "react";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as appStyle from "./AppStyleSheet";
const Map = (props) => {
  const [markerCoords, setMarkerCoords] = useState(props.defaultMarker);
  const newMarkerCoords = (coords) => {
    setMarkerCoords(coords);
    console.log(coords);
  };
  console.log(props.defaultMarker);
  return (
    <View className="items-center" style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: props.defaultMarker.latitude,
          longitude: props.defaultMarker.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          draggable
          coordinate={markerCoords}
          onDragEnd={(e) => newMarkerCoords(e.nativeEvent.coordinate)}
        />
      </MapView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 400,
    width: 400,
  },
  map: {
    height: 400,
    width: 400,
  },
});
export default Map;
