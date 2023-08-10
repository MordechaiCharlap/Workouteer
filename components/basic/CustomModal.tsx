import React from "react";
import { ViewProps, View, Text, TouchableOpacity } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutRight,
  SlideInDown,
} from "react-native-reanimated";
import { convertHexToRgba } from "../../utils/stylingFunctions";
import CustomButton from "./CustomButton";
import {
  color_on_primary,
  color_primary,
  color_surface,
} from "../../utils/appStyleSheet";

interface CustomModalProps extends ViewProps {
  showModal: boolean;
  setShowModal: Function;
  closeOnTouchOutside?: true;
}

const CustomModal: React.FC<CustomModalProps> = ({
  showModal,
  setShowModal,
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
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
        entering={FadeIn.springify()}
        exiting={FadeOut.springify()}
      >
        <TouchableOpacity
          style={{ height: "100%", width: "100%" }}
          onPress={() => (closeOnTouchOutside ? setShowModal(false) : {})}
        >
          <Animated.View
            entering={FadeInRight.springify()}
            exiting={FadeOutRight.springify()}
            style={[
              { borderRadius: 8, backgroundColor: color_surface, padding: 8 },
              clientStyle,
            ]}
            {...restPropsWithoutStyle}
          >
            <CustomButton
              onPress={() => setShowModal(false)}
              style={{ backgroundColor: color_primary }}
            >
              <Text style={{ color: color_on_primary }}>Hey</Text>
            </CustomButton>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    )
  );
};
export default CustomModal;
