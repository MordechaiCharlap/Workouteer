import * as appStyle from "./AppStyleSheet";
import { isWebOnPC } from "../services/webScreenService";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
export const safeAreaStyle = () => {
  var style;
  if (isWebOnPC) {
    console.log("web on pc");
    console.log(window.navigator.userAgent);
    const { showNavbar } = useNavbarDisplay();
    style = {
      height: window.innerHeight - (showNavbar ? 50 : 0),
      flex: 1,
      alignSelf: "center",
      aspectRatio: "9/19",
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
