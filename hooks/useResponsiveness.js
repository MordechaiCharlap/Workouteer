import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { Dimensions } from "react-native";
import { isWebOnMobileDevice } from "../services/webScreenService";
const WebDeviceResponsivenessContext = createContext({});

export const ResponsivenessProvider = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );
  const [windowHeight, setWindowHeight] = useState(
    Dimensions.get("window").height
  );
  const [orientation, setOrientation] = useState();
  const [windowTooSmall, setWindowTooSmall] = useState(false);
  useEffect(() => {
    console.log(windowHeight);
  }, [windowHeight]);
  const webResizeHandler = () => {
    setTimeout(() => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
      if (window.innerHeight <= 572 || window.innerWidth <= 271) {
        setWindowTooSmall(true);
      } else {
        setWindowTooSmall(false);
      }
    }, 100);
  };
  const isPortrait = () => {
    return Dimensions.get("window").width <= Dimensions.get("window").height;
  };
  const orientationHandler = () => {
    setTimeout(() => {
      setOrientation(isPortrait() ? "PORTRAIT" : "LANDSCAPE");
    }, 100);
  };
  useEffect(() => {
    if (Platform.OS == "web") {
      if (isWebOnMobileDevice) {
        setWindowHeight(Dimensions.get("window").height);
        setWindowWidth(Dimensions.get("window").width);
        orientationHandler();
        Dimensions.addEventListener("change", orientationHandler);
        return () => {
          Dimensions.removeEventListener("change", orientationHandler);
        };
      } else {
        webResizeHandler();
        window.addEventListener("resize", webResizeHandler);
        return () => {
          window.removeEventListener("resize", webResizeHandler);
        };
      }
    }
  }, []);
  return (
    <WebDeviceResponsivenessContext.Provider
      value={{
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
