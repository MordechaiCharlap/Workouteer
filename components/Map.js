import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as appStyle from "./AppStyleSheet";
const Map = (props) => {
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
        <Marker draggable coordinate={props.defaultMarker} />
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
