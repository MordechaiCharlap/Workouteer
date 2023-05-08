import { View, Text, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { React } from "react";
import { safeAreaStyle } from "../components/safeAreaStyle";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import useAuth from "../hooks/useAuth";
import languageService from "../services/languageService";
const ChangePreferencesScreen = () => {
  const { user } = useAuth();
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("ChangePreferences");
    }, [])
  );
  return (
    <View style={safeAreaStyle()}>
      <View className="flex-1 justify-center">
        <Text className="text-4xl text-white font-bold text-center">
          {languageService[user.language].comingSoon}
        </Text>
      </View>
    </View>
  );
};

export default ChangePreferencesScreen;
