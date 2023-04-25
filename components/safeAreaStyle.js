import * as appStyle from "../utilites/appStyleSheet";
import { isWebOnPC } from "../services/webScreenService";
import useWebResponsiveness from "../hooks/useWebResponsiveness";
import { Dimensions } from "react-native";
export const safeAreaStyle = () => {
  var style;
  if (isWebOnPC) {
    const { windowHeight } = useWebResponsiveness();
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
