
import { TailwindProvider } from 'tailwindcss-react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import UserScreen from './screens/UserScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
      <TailwindProvider>
          <Stack.Navigator>
            <Stack.Screen name="User" component={UserScreen}/>
            <Stack.Screen name="Home" component={HomeScreen}/>
          </Stack.Navigator>
        </TailwindProvider>
      </NavigationContainer>
    
    
    
  );
}