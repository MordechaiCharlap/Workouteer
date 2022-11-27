import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as appStyle from "./AppStyleSheet";
const Map = () => {
  return (
    <View className="items-center" style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 400,
    width: 400,
  },
  map: {
    height: 300,
    width: 300,
  },
});
export default Map;
