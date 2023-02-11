import { View, Text, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { React } from "react";
import responsiveStyle from "../components/ResponsiveStyling";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
const ChangePreferencesScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("ChangePreferences");
    }, [])
  );
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View className="flex-1 justify-center">
        <Text className="text-4xl text-white font-bold text-center">
          Coming soon!
        </Text>
      </View>
    </View>
  );
};

export default ChangePreferencesScreen;
