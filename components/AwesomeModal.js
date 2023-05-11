import { View, Text, Dimensions } from "react-native";
import React from "react";
import AwesomeAlert from "react-native-awesome-alerts";
import languageService from "../services/languageService";
import * as appStyle from "../utilities/appStyleSheet";
import useAuth from "../hooks/useAuth";
import { isWebOnPC } from "../services/webScreenService";
import useWebResponsiveness from "../hooks/useWebResponsiveness";
const AwesomeModal = (props) => {
  const { user } = useAuth();
  var fixedWidth;
  if (isWebOnPC) {
    const { windowHeight } = useWebResponsiveness();
    fixedWidth =
      (9 / 19) *
      (windowHeight ? windowHeight : Dimensions.get("window").height);
  }
  return (
    <AwesomeAlert
      overlayStyle={fixedWidth ? { width: fixedWidth } : {}}
      contentContainerStyle={{
        backgroundColor: appStyle.color_bg,
      }}
      confirmButtonStyle={{ backgroundColor: appStyle.color_primary }}
      cancelButtonStyle={{}}
      cancelButtonTextStyle={{ color: appStyle.color_primary }}
      titleStyle={{ color: appStyle.color_primary, textAlign: "center" }}
      messageStyle={{ color: appStyle.color_primary }}
      show={props.showModal}
      showProgress={props.showProgress ? props.showProgress : false}
      title={props.title ? props.title : ""}
      message={props.message ? props.message : ""}
      onDismiss={
        props.onDismiss
          ? () => {
              props.onDismiss();
            }
          : () => {
              props.setShowModal(false);
            }
      }
      closeOnTouchOutside={
        props.closeOnTouchOutside ? props.closeOnTouchOutside : true
      }
      closeOnHardwareBackPress={
        props.closeOnHardwareBackPress ? props.closeOnHardwareBackPress : true
      }
      showConfirmButton={props.showConfirmButton ? showConfirmButton : true}
      confirmText={
        props.confirmText
          ? props.confirmText
          : languageService[user.language].continue[user.isMale ? 1 : 0]
      }
      confirmButtonColor="#DD6B55"
      showCancelButton={
        props.showCancelButton != null ? props.showCancelButton : true
      }
      cancelText={
        props.cancelText
          ? props.cancelText
          : languageService[user.language].cancel
      }
      onCancelPressed={() => {
        props.setShowModal(false);
      }}
      onConfirmPressed={
        props.onConfirm
          ? () => {
              props.onConfirm();
            }
          : () => {
              props.setShowModal(false);
            }
      }
    />
  );
};

export default AwesomeModal;
