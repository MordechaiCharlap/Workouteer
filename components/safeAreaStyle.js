import * as appStyle from "./AppStyleSheet";
import { isWebOnPC } from "../services/webScreenService";
import useWebResponsiveness from "../hooks/useWebResponsiveness";
export const safeAreaStyle = () => {
  var style;
  if (isWebOnPC) {
    const { windowHeight } = useWebResponsiveness();
    const fixedWidth =
      (9 / 19) * (windowHeight ? windowHeight : window.innerHeight);
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
