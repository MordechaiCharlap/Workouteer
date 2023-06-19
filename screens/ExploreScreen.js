import { View, Text } from "react-native";
import { React, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import useAuth from "../hooks/useAuth";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import languageService from "../services/languageService";
import SearchUsers from "../components/SearchUsers";
import Explore from "../components/Explore";

const ExploreScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { setScreen } = useNavbarNavigation();
  const { user } = useAuth();
  const [searchInputEmpty, setSearchInputEmpty] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setScreen("Explore");
      setCurrentScreen("Explore");
    }, [])
  );

  return (
    <View style={safeAreaStyle()}>
      <View className="flex-1">
        <SearchUsers
          language={user.language}
          setIsEmpty={setSearchInputEmpty}
        />
        {searchInputEmpty == true && <Explore />}
      </View>
    </View>
  );
};
export default ExploreScreen;
