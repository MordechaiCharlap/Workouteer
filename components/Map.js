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
  return (
    <View className="items-center">
      <View>
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
        {/* <View className="absolute" style={{ left: "50%", top: "50%" }}>
          <View className="flex-row">
            <View>
              <FontAwesomeIcon
                icon={faDotCircle}
                color={appStyle.appDarkBlue}
                size={30}
              />
              <FontAwesomeIcon
                icon={faDotCircle}
                color={appStyle.appDarkBlue}
                size={30}
              />
            </View>
            <View>
              <FontAwesomeIcon
                icon={faDotCircle}
                color={appStyle.appDarkBlue}
                size={30}
              />
              <FontAwesomeIcon
                icon={faDotCircle}
                color={appStyle.appDarkBlue}
                size={30}
              />
            </View>
          </View>
        </View> */}
      </View>

      <TouchableOpacity onPress={() => saveRegion()}>
        <Text>Save location</Text>
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
