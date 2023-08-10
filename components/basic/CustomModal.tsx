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
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => (closeOnTouchOutside ? setShowModal(false) : {})}
        >
          <Animated.View
            entering={FadeInLeft.springify()}
            exiting={FadeOutRight.springify()}
            style={[
              {
                borderRadius: 12,
                backgroundColor: color_surface,
                padding: 8,
              },
              clientStyle,
            ]}
            {...restPropsWithoutStyle}
          >
            {/* <CustomButton
              onPress={() => setShowModal(false)}
              style={{ backgroundColor: color_primary }}
            >
              <Text style={{ color: color_on_primary }}>Hey</Text>
            </CustomButton> */}
            {children}
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    )
  );
};
export default CustomModal;
