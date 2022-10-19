import { TailwindProvider } from "tailwindcss-react-native";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";
import AuthContext from "./context/authContext";
import { useState } from "react";
export default function App() {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <TailwindProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </TailwindProvider>
    </AuthContext.Provider>
  );
}
