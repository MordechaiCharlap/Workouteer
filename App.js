import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import { initGeocoder } from "./geocoder";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import ProviderWrapper from "./ProviderWrapper";
export default function App() {
  SplashScreen.preventAutoHideAsync();
  WebBrowser.maybeCompleteAuthSession();
  if (Platform.OS != "web") {
    const { enableLatestRenderer } = require("react-native-maps");
    enableLatestRenderer();
  }
  initGeocoder();

  return (
    <NavigationContainer>
      <ProviderWrapper>
        <StackNavigator />
      </ProviderWrapper>
    </NavigationContainer>
  );
}
