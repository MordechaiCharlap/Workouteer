import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import { AuthPrvider } from "./hooks/useAuth";
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
