import { View, Text, Dimensions } from "react-native";
import React from "react";
import AwesomeAlert from "react-native-awesome-alerts";
import languageService from "../services/languageService";
import * as appStyle from "../utilities/appStyleSheet";
import useAuth from "../hooks/useAuth";
import { isWebOnPC } from "../services/webScreenService";
import useResponsiveness from "../hooks/useResponsiveness";
import { safeAreaStyle } from "./safeAreaStyle";
const AwesomeModal = (props) => {
  const { user } = useAuth();
  var fixedWidth;
  if (isWebOnPC) {
    const { windowHeight } = useResponsiveness();
    fixedWidth =
      (9 / 19) *
      (windowHeight ? windowHeight : Dimensions.get("window").height);
  }
  return (
    <AwesomeAlert
      overlayStyle={{ width: safeAreaStyle().width, height: "100%" }}
      contentContainerStyle={{
        borderWidth: 0.5,
        borderColor: appStyle.color_outline,
        backgroundColor: appStyle.color_surface,
      }}
      confirmButtonStyle={{ borderRadius: 999, paddingHorizontal: 16 }}
      cancelButtonStyle={{ borderRadius: 999, paddingHorizontal: 16 }}
      confirmButtonTextStyle={{ color: appStyle.color_on_primary }}
      cancelButtonTextStyle={{ color: appStyle.color_background }}
      confirmButtonColor={appStyle.color_primary}
      cancelButtonColor={appStyle.color_on_background}
      titleStyle={{ color: appStyle.color_on_surface, textAlign: "center" }}
      messageStyle={{ color: appStyle.color_on_surface }}
      show={props.showModal}
      showProgress={props.showProgress ? props.showProgress : false}
      title={props.title ? props.title : ""}
      message={props.message ? props.message : ""}
      onDismiss={
        props.onDismiss
          ? () => {
              props.onDismiss();
            }
          : props.onCancelPressed
          ? () => {
              props.onCancelPressed();
            }
          : () => props.setShowModal(false)
      }
      closeOnTouchOutside={
        props.closeOnTouchOutside != null ? props.closeOnTouchOutside : true
      }
      closeOnHardwareBackPress={
        props.closeOnHardwareBackPress != null
          ? props.closeOnHardwareBackPress
          : true
      }
      showConfirmButton={
        props.showConfirmButton != null ? props.showConfirmButton : true
      }
      confirmText={
        props.confirmText
          ? props.confirmText
          : languageService[user.language].continue[user.isMale ? 1 : 0]
      }
      showCancelButton={
        props.showCancelButton != null ? props.showCancelButton : true
      }
      cancelText={
        props.cancelText
          ? props.cancelText
          : languageService[user.language].cancel
      }
      onCancelPressed={() => {
        props.onCancelPressed();
      }}
      onConfirmPressed={
        props.onConfirmPressed
          ? () => {
              props.onConfirmPressed();
            }
          : () => {
              props.setShowModal(false);
            }
      }
      customView={props.customView ? props.customView : null}
    />
  );
};

export default AwesomeModal;
