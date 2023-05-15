import * as appStyle from "../utilities/appStyleSheet";
import { isWebOnPC } from "../services/webScreenService";
import useResponsiveness from "../hooks/useResponsiveness";
import { Dimensions } from "react-native";
export const safeAreaStyle = () => {
  var style;
  if (isWebOnPC) {
    const { windowHeight } = useResponsiveness();
    const fixedWidth =
      (9 / 19) *
      (windowHeight ? windowHeight : Dimensions.get("window").height);
    style = {
      height: "100%",
      flex: 1,
      alignSelf: "center",
      aspectRatio: fixedWidth,
      width: fixedWidth,
      backgroundColor: appStyle.color_bg,
    };
  } else {
    style = {
      height: "100%",
      flex: 1,
      backgroundColor: appStyle.color_bg,
    };
  }
  return style;
};
