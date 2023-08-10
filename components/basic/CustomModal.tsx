import React from "react";
import { ViewProps, View, Text, TouchableOpacity } from "react-native";
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeOut,
  FadeOutRight,
} from "react-native-reanimated";
import { color_surface } from "../../utils/appStyleSheet";

interface CustomModalProps extends ViewProps {
  showModal: boolean;
  setShowModal: Function;
  closeOnTouchOutside?: true;
}

const CustomModal: React.FC<CustomModalProps> = ({
  showModal,
  setShowModal,
  children,
  closeOnTouchOutside,
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
            padding: 16,
            position: "absolute",
          }}
          onPress={() => (closeOnTouchOutside ? setShowModal(false) : {})}
        ></TouchableOpacity>
        <Animated.View
          entering={FadeInLeft.springify()}
          exiting={FadeOutRight.springify()}
          style={[
            {
              borderRadius: 12,
              backgroundColor: color_surface,
              padding: 8,
              position: "absolute",
            },
            clientStyle,
          ]}
          {...restPropsWithoutStyle}
        >
          {children}
        </Animated.View>
      </Animated.View>
    )
  );
};
export default CustomModal;
