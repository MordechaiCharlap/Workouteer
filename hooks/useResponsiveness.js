import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { Dimensions } from "react-native";
import { isWebOnMobileDevice } from "../services/webScreenService";
const WebDeviceResponsivenessContext = createContext({});
const isPortrait = () => {
  return window.innerWidth <= Dimensions.get("window").height;
};
export const ResponsivenessProvider = ({ children }) => {
  const [isWeb, setIsWeb] = useState();
  const [windowWidth, setWindowWidth] = useState();
  const [windowHeight, setWindowHeight] = useState();
  const [orientation, setOrientation] = useState();
  const [windowTooSmall, setWindowTooSmall] = useState(false);
  const resizeHandler = () => {
    setTimeout(() => {
      setWindowHeight(Dimensions.get("window").height);
      setWindowWidth(window.innerWidth);
      if (Dimensions.get("window").height <= 572 || window.innerWidth <= 271) {
        setWindowTooSmall(true);
      } else {
        setWindowTooSmall(false);
      }
    }, 100);
  };
  useEffect(() => {
    if (Platform.OS == "web") {
      const orientationHandler = () => {
        setOrientation(isPortrait() ? "PORTRAIT" : "LANDSCAPE");
      };

      if (isWebOnMobileDevice) {
        orientationHandler();
        Dimensions.addEventListener("change", orientationHandler);
        return () => {
          Dimensions.removeEventListener("change", orientationHandler);
        };
      } else {
        resizeHandler();
        window.addEventListener("resize", resizeHandler);
        return () => {
          window.removeEventListener("resize", resizeHandler);
        };
      }
    } else {
    }
  }, []);
  return (
    <WebDeviceResponsivenessContext.Provider
      value={{
        isWeb,
        setIsWeb,
        windowWidth,
        windowHeight,
        orientation,
        windowTooSmall,
      }}
    >
      {children}
    </WebDeviceResponsivenessContext.Provider>
  );
};
export default function useResponsiveness() {
  return useContext(WebDeviceResponsivenessContext);
}
