import { Platform } from "react-native";
import MapView, { Marker as NativeMarker } from "react-native-maps";
export const Marker = Platform.OS === "web" ? MapView.Marker : NativeMarker;
