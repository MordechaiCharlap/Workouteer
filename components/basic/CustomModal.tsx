import React from "react";
import { ViewProps, View, Text, TouchableOpacity } from "react-native";
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeOut,
  FadeOutRight,
} from "react-native-reanimated";
import * as appStyle from "../../utils/appStyleSheet";
import CustomButton from "./CustomButton";
import CustomText from "./CustomText";
import languageService from "../../services/languageService";

interface CustomModalProps extends ViewProps {
  showModal: boolean;
  setShowModal: Function;
  closeOnTouchOutside?: true;
  confirmButton?: true;
  cancelButton?: true;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  onConfirm?: Function;
  confirmText?: string;
  cancelText?: string;
  language?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  showModal,
  setShowModal,
  children,
  closeOnTouchOutside,
  confirmButton,
  cancelButton,
  confirmButtonColor,
  cancelButtonColor,
  onConfirm,
  confirmText,
  cancelText,
  language,
  ...restProps
}) => {
  const clientStyle = restProps.style;
  const restPropsWithoutStyle = restProps;
  delete restPropsWithoutStyle.style;
  return (
    showModal && (
      <Animated.View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          justifyContent: "center",
          alignItems: "center",
        }}
        entering={FadeIn.springify()}
        exiting={FadeOut.springify()}
      >
        <TouchableOpacity
          disabled={!closeOnTouchOutside}
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
          }}
          onPress={() => (closeOnTouchOutside ? setShowModal(false) : {})}
        ></TouchableOpacity>
        <Animated.View
          entering={FadeInLeft.springify()}
          exiting={FadeOutRight.springify()}
          style={[
            {
              margin: 16,
              borderRadius: 12,
              backgroundColor: appStyle.color_surface,
              padding: 8,
              position: "absolute",
            },
            clientStyle,
          ]}
          {...restPropsWithoutStyle}
        >
          {children}
          {(confirmButton || cancelButton) && (
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                columnGap: confirmButton && cancelButton && 10,
              }}
            >
              {cancelButton && (
                <CustomButton
                  onPress={() => setShowModal(false)}
                  round
                  style={{
                    flexGrow: 1,
                    borderColor: appStyle.color_on_surface,
                    borderWidth: 0.5,
                    backgroundColor: cancelButtonColor,
                  }}
                >
                  <CustomText>
                    {cancelText
                      ? cancelText
                      : language
                      ? languageService[language].cancel
                      : languageService["english"].cancel}
                  </CustomText>
                </CustomButton>
              )}
              {confirmButton && (
                <CustomButton
                  onPress={() => {
                    setShowModal(false);
                    onConfirm && onConfirm();
                  }}
                  round
                  style={{
                    flexGrow: 1,
                    borderColor: appStyle.color_on_surface,
                    borderWidth: 0.5,
                    backgroundColor:
                      confirmButtonColor || appStyle.color_on_surface,
                  }}
                >
                  <Text style={{ color: appStyle.color_surface }}>
                    {cancelText
                      ? confirmText
                      : language
                      ? languageService[language].confirm
                      : languageService["english"].confirm}
                  </Text>
                </CustomButton>
              )}
            </View>
          )}
        </Animated.View>
      </Animated.View>
    )
  );
};
export default CustomModal;
