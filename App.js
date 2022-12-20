import "react-native-gesture-handler";
import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import { AuthPrvider } from "./hooks/useAuth";
import { enableLatestRenderer } from "react-native-maps";
import { initGeocoder } from "./geocoder";
import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();
enableLatestRenderer();
initGeocoder();
export default function App() {
  return (
    <NavigationContainer>
      <AuthPrvider>
        <TailwindProvider>
          <StackNavigator />
        </TailwindProvider>
      </AuthPrvider>
    </NavigationContainer>
  );
}
