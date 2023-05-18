import { StyleSheet } from "react-native";
import * as appStyle from "./appStyleSheet";
const appComponentsDefaultStyles = StyleSheet.create({
  input: {
    borderRadius: 4,
    justifyContent: "center",
    paddingHorizontal: 10,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: appStyle.color_outline,
    backgroundColor: appStyle.color_surface_variant,
  },
  errorInput: {
    borderRadius: 4,
    justifyContent: "center",
    paddingHorizontal: 10,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: appStyle.color_error,
    backgroundColor: appStyle.color_surface_variant,
  },
  textOnInput: {
    color: appStyle.color_on_surface_variant,
  },
  placeholder: {},
});

export default appComponentsDefaultStyles;
