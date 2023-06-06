import { View, Text } from "react-native";
import { React, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import useAuth from "../hooks/useAuth";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import languageService from "../services/languageService";

const ExploreScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { setScreen } = useNavbarNavigation();
  const { user } = useAuth();

  const [renderOption, setRenderOption] = useState("Explore");
  const [searchInputEmpty, setSearchInputEmpty] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setScreen("Explore");
      setCurrentScreen("Explore");
    }, [])
  );

  return (
    <View style={safeAreaStyle()}>
      <View className="flex-1 justify-center items-center">
        <Text className="text-3xl font-semibold">
          {languageService[user.language].comingSoon}
        </Text>
        {/* {renderOption == "Explore" && (
          <SearchUsers
            language={user.language}
            setIsEmpty={(isEmpty) => setSearchInputEmpty(isEmpty)}
          />
        )}
        {renderOption == "Explore" && searchInputEmpty == true && <Explore />} */}
      </View>
    </View>
  );
};
export default ExploreScreen;
