import * as appStyle from "./AppStyleSheet";
import { isWebOnPC } from "../services/webScreenService";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import useWebResponsiveness from "../hooks/useWebResponsiveness";
export const safeAreaStyle = () => {
  var style;
  if (isWebOnPC) {
    console.log("web on pc");
    console.log(window.navigator.userAgent);
    const { showNavbar } = useNavbarDisplay();
    const { windowHeight } = useWebResponsiveness();
    const fixedHeight = windowHeight
      ? windowHeight - (showNavbar ? 50 : 0)
      : window.innerHeight - (showNavbar ? 50 : 0);
    const fixedWidth =
      (9 / 19) * (windowHeight ? windowHeight : window.innerHeight);
    style = {
      height: fixedHeight,
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
  console.log(`safe are style: ${style}`);
  return style;
};
