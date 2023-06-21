import * as appStyle from "../utils/appStyleSheet";
import { isWebOnPC } from "../services/webScreenService";
import useResponsiveness from "../hooks/useResponsiveness";
import { Dimensions } from "react-native";
export const safeAreaStyle = () => {
  var style;
  if (isWebOnPC) {
    const { windowHeight } = useResponsiveness();
    const fixedWidth =
      (9 / 19) * (windowHeight || Dimensions.get("window").height);
    style = {
      height: "100%",
      flex: 1,
      aspectRatio: fixedWidth,
      width: fixedWidth,
      backgroundColor: appStyle.color_background,
    };
  } else {
    style = {
      height: "100%",
      width: "100%",
      flex: 1,
      backgroundColor: appStyle.color_background,
    };
  }
  return style;
};
