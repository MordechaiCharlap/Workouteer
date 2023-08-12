import { createContext, useContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { Modal, View } from "react-native";
import CustomText from "../components/basic/CustomText";
import Animated, {
  FadeInDown,
  FadeOutDown,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const ConnectionContext = createContext({});
export const ConnectionProvider = ({ children }) => {
  return (
    <>
      {children}
      <BottomConnectionBar />
    </>
  );
};
export const useConnection = () => useContext(ConnectionContext);
const BottomConnectionBar = () => {
  const [connected, setConnected] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const connectedVal = useSharedValue(connected);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (!connected) {
      connectedVal.value = connected;
      setShowModal(true);
    } else if (showModal) {
      connectedVal.value = withTiming(connected);
      setTimeout(() => {
        setShowModal(false);
      }, 1000);
    }
  }, [connected]);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setConnected((prev) => !prev);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);
  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     backgroundColor: interpolateColor(
  //       connectedVal.value,
  //       [true, false],
  //       ["green", "black"]
  //     ),
  //   };
  // });
  return (
    showModal && (
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
    )
  );
};
