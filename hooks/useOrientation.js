import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { isWebOnMobileDevice } from "../services/webScreenService";

const isPortrait = () => {
  return window.innerWidth <= window.innerHeight;
};
const useOrientation = () => {
  if (isWebOnMobileDevice) {
    // State to hold the connection status
    const [orientation, setOrientation] = useState(
      isPortrait() ? "PORTRAIT" : "LANDSCAPE"
    );

    useEffect(() => {
      const callback = () =>
        setOrientation(isPortrait() ? "PORTRAIT" : "LANDSCAPE");

      Dimensions.addEventListener("change", callback);
      console.log("started listening to orientation");
      return () => {
        Dimensions.removeEventListener("change", callback);
      };
    }, []);

    return orientation;
  } else return null;
};
export default useOrientation;
