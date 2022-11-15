import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import authContext from "./context/authContext";
import { useState } from "react";
import { AuthPrvider } from "./hooks/useAuth";
export default function App() {
  const [user, setUser] = useState(null);
  return (
    <NavigationContainer>
      <AuthPrvider>
        <authContext.Provider value={{ user, setUser }}>
          <TailwindProvider>
            <StackNavigator />
          </TailwindProvider>
        </authContext.Provider>
      </AuthPrvider>
    </NavigationContainer>
  );
}
