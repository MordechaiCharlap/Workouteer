import { View, Text } from "react-native";
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
    <View className="flex-1 justify-center">
      <Text className="text-4xl text-white font-bold text-center">
        {languageService[user.language].comingSoon}
      </Text>
    </View>
  );
};

export default ChangePreferencesScreen;
