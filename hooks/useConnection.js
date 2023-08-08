import { createContext, useContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { Modal, View } from "react-native";
import CustomText from "../components/basic/CustomText";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const ConnectionContext = createContext({});
export const ConnectionProvider = ({ children }) => {
  const [connected, setConnected] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const connectedVal = useSharedValue(connected);
  useEffect(() => {
    if (!connected) {
      connectedVal.value = connected;
      setShowModal(true);
    } else if (showModal) {
      connectedVal.value = withTiming(connected);
      setTimeout(() => {
        setShowModal(false);
      }, 1500);
    }
  }, [connected]);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        connectedVal.value,
        [true, false],
        ["green", "black"]
      ),
    };
  });
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ConnectionContext.Provider value={{ connected }}>
      {children}
      {showModal && (
        <Animated.View
          entering={FadeInDown.stiffness()}
          exiting={FadeOutDown.stiffness()}
          style={[
            {
              position: "absolute",
              width: "100%",
              bottom: 0,
              paddingVertical: 8,
            },
            animatedStyle,
          ]}
        >
          <CustomText style={{ color: "white", textAlign: "center" }}>
            {!connected ? "App is offline" : "Back online"}
          </CustomText>
        </Animated.View>
      )}
    </ConnectionContext.Provider>
  );
};
export const useConnection = () => useContext(ConnectionContext);
