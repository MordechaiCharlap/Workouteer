import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { Dimensions } from "react-native";
import { isWebOnMobileDevice, isWebOnPC } from "../services/webScreenService";
const WebDeviceResponsivenessContext = createContext({});
const isPortrait = () => {
  return window.innerWidth <= window.innerHeight;
};
export const WebResponsivenessProvider = ({ children }) => {
  const [isWeb, setIsWeb] = useState();
  const [windowWidth, setWindowWidth] = useState();
  const [windowHeight, setWindowHeight] = useState();
  const [orientation, setOrientation] = useState();
  const [windowTooSmall, setWindowTooSmall] = useState(false);
  useEffect(() => {
    if (Platform.OS == "web") {
      console.log("***OnWeb responsiveness in action***");
      const orientationHandler = () => {
        setOrientation(isPortrait() ? "PORTRAIT" : "LANDSCAPE");
        console.log("orientationHandled");
      };

      const resizeHandler = () => {
        setWindowHeight(window.innerHeight);
        setWindowWidth(window.innerWidth);
        if (window.innerHeight <= 572 || window.innerWidth <= 271) {
          if (windowTooSmall != true) {
            setWindowTooSmall(true);
          }
        } else {
          if (windowTooSmall != false) {
            setWindowTooSmall(false);
          }
        }
      };
      if (isWebOnMobileDevice) {
        orientationHandler();
        Dimensions.addEventListener("change", orientationHandler);
        console.log("started listening to orientation");
      } else {
        resizeHandler();
        window.addEventListener("resize", resizeHandler);
        console.log("started listening to resize");
      }

      return () => {
        isWebOnMobileDevice
          ? Dimensions.removeEventListener("change", orientationHandler)
          : window.removeEventListener("resize", resizeHandler);
      };
    } else {
      console.log("***Not OnWeb, no need for WebResponsiveness**");
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
export default function useWebResponsiveness() {
  return useContext(WebDeviceResponsivenessContext);
}
