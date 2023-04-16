import { Platform } from "react-native";

export const isWebOnMobileDevice =
  Platform.OS == "web" &&
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
export const isWebOnPC =
  Platform.OS == "web" &&
  !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
